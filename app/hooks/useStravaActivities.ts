import { useState, useEffect, useCallback } from 'react';
import { Session } from 'next-auth';
import { StravaActivity, StravaAthlete } from '@/types/strava';
import {
  STORAGE_KEY,
  CacheInfo,
  getFromLocalStorage,
  saveToLocalStorage,
  calculateCacheExpiry,
} from '@/utils/cache';

interface StravaActivitiesState {
  activities: StravaActivity[];
  athlete: StravaAthlete | null;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  cacheInfo: CacheInfo | null;
}

interface UseStravaActivitiesReturn extends StravaActivitiesState {
  refresh: () => Promise<void>;
  loadMore: () => void;
  clearCache: () => void;
}

interface ActivityResponse {
  activities: StravaActivity[];
  athlete?: StravaAthlete;
  has_more: boolean;
}

async function fetchActivitiesFromApi(page: number, includeAthlete: boolean = false): Promise<ActivityResponse> {
  const response = await fetch(
    `/api/activities?page=${page}&per_page=10${includeAthlete ? '&include_athlete=true' : ''}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }
  
  return response.json();
}

export function useStravaActivities(session: Session | null): UseStravaActivitiesReturn {
  const [state, setState] = useState<StravaActivitiesState>({
    activities: [],
    athlete: null,
    loading: true,
    error: null,
    page: 1,
    hasMore: true,
    cacheInfo: null,
  });

  const updateState = useCallback((updates: Partial<StravaActivitiesState>) => {
    setState(current => ({ ...current, ...updates }));
  }, []);

  const fetchActivities = useCallback(async (targetPage: number, forceRefresh: boolean = false): Promise<void> => {
    if (!session) return;

    try {
      updateState({ loading: true, error: null });

      // Check cache unless forcing refresh
      if (!forceRefresh) {
        const cached = getFromLocalStorage();
        if (cached) {
          if (targetPage === 1) {
            updateState({
              activities: cached.activities,
              athlete: cached.athlete,
              hasMore: cached.hasMore,
              loading: false,
              page: targetPage,
              cacheInfo: {
                isCached: true,
                expiresIn: calculateCacheExpiry(cached.timestamp),
              },
            });
            return;
          } else if (targetPage <= cached.page) {
            updateState({ loading: false });
            return;
          }
        }
      }

      const data = await fetchActivitiesFromApi(targetPage, targetPage === 1);
      const fetchedActivities = data.activities as StravaActivity[];

      // Update state with all changes
      setState(currentState => {
        // Prepare the new activities list
        const activities = targetPage === 1 
          ? fetchedActivities 
          : [...new Map([...currentState.activities, ...fetchedActivities].map(a => [a.id, a])).values()];
        
        // Cache the complete data
        saveToLocalStorage({
          activities,
          athlete: data.athlete || currentState.athlete,
          page: targetPage,
          hasMore: data.has_more,
          timestamp: Date.now(),
        });

        // Return new state
        return {
          ...currentState,
          activities,
          hasMore: data.has_more && fetchedActivities.length > 0,
          loading: false,
          page: targetPage,
          ...(data.athlete ? { athlete: data.athlete } : {}),
          cacheInfo: {
            isCached: true,
            expiresIn: '7d 0h',
          },
        };
      });
    } catch (err) {
      updateState({
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      });
    }
  }, [session, updateState]);

  // Initial fetch on mount or session change
  useEffect(() => {
    if (session) {
      fetchActivities(1);
    }
  }, [session, fetchActivities]);

  const refresh = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(currentState => ({
      ...currentState,
      cacheInfo: null
    }));
    await fetchActivities(1, true);
  }, [fetchActivities]);

  const loadMore = useCallback(() => {
    setState(currentState => {
      if (!currentState.loading && currentState.hasMore) {
        fetchActivities(currentState.page + 1);
      }
      return currentState;
    });
  }, [fetchActivities]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(currentState => ({
      ...currentState,
      page: 1,
      cacheInfo: null
    }));
    fetchActivities(1, true);
  }, [fetchActivities]);

  return {
    ...state,
    refresh,
    loadMore,
    clearCache,
  };
}
