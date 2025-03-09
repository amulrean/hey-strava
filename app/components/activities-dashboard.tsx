'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StravaActivity, StravaAthlete } from "@/types/strava";
import { ActivityCard } from "./activity-card";
import { BrandLogo } from "./brand-logo";
import {
  STORAGE_KEY,
  CacheInfo,
  getFromLocalStorage,
  saveToLocalStorage,
  getCacheSize,
  cleanupExpiredCaches,
  calculateCacheExpiry
} from "@/utils/cache";

export function ActivitiesDashboard() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const [athlete, setAthlete] = useState<StravaAthlete | null>(null);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      if (!session) return;
      
      try {
        setLoading(true);
        setError(null);

        // Check local storage first if we're on page 1
        if (page === 1) {
          const cached = getFromLocalStorage();
          if (cached) {
            setActivities(cached.activities);
            setAthlete(cached.athlete);
            setPage(cached.page);
            setHasMore(cached.hasMore);
            setLoading(false);
            
            setCacheInfo({
              isCached: true,
              expiresIn: calculateCacheExpiry(cached.timestamp)
            });
            return;
          }
        }

        // Include athlete info only on first load
        const includeAthlete = page === 1;
        const response = await fetch(
          `/api/activities?page=${page}&per_page=10${includeAthlete ? '&include_athlete=true' : ''}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data = await response.json();
        const newActivities = page === 1 ? data.activities : [...activities, ...data.activities];
        const newAthlete = includeAthlete && data.athlete ? data.athlete : athlete;
        
        setActivities(newActivities);
        setHasMore(data.has_more);
        
        if (includeAthlete && data.athlete) {
          setAthlete(data.athlete);
        }
        
        const timestamp = Date.now();
        // Cache the complete data
        saveToLocalStorage({
          activities: newActivities,
          athlete: newAthlete,
          page,
          hasMore: data.has_more,
          timestamp,
        });
        
        // Update cache info
        setCacheInfo({
          isCached: true,
          expiresIn: '7d 0h'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [session, page]);

  if (!session) {
    return null;
  }

  const handleRefresh = () => {
    setPage(1);
    localStorage.removeItem(STORAGE_KEY);
    setCacheInfo(null);
  };

  const handleClearCache = () => {
    cleanupExpiredCaches();
    setPage(1);
    setCacheInfo(null);
    const size = getCacheSize();
    if (size > 0) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">Your Activities</h2>
            {cacheInfo?.isCached && (
              <p className="text-xs text-gray-500 mt-1">
                Using cached data (expires in {cacheInfo.expiresIn})
                {getCacheSize() > 0 && ` • ${(getCacheSize() / 1024).toFixed(1)}KB cached`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {cacheInfo?.isCached && (
              <button
                onClick={handleClearCache}
                className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                title="Clear cached data"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            )}
            <button
              onClick={handleRefresh}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={loading ? 'animate-spin' : ''}
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-4 text-red-600 border border-red-200 bg-red-50">
          {error}
        </div>
      )}

      <div className="border rounded divide-y">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {activities.length > 0 && !loading && hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm border hover:bg-gray-50"
          >
            Load More
          </button>
        </div>
      )}

      {loading && (
        <div className="py-4 text-center text-gray-500">
          Loading...
        </div>
      )}

      {!loading && activities.length === 0 && !error && (
        <div className="py-4 text-center text-gray-500">
          No activities found. Go record some activities on Strava!
        </div>
      )}
    </div>
  );
}
