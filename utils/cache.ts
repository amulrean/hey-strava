import { StravaActivity, StravaAthlete } from "@/types/strava";

export const STORAGE_KEY = 'hey_strava';
export const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
export const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB

export interface CachedData {
  activities: StravaActivity[];
  athlete: StravaAthlete | null;
  timestamp: number;
  page: number;
  hasMore: boolean;
}

export interface CacheInfo {
  isCached: boolean;
  expiresIn: string;
}

export function getFromLocalStorage(): CachedData | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const data = JSON.parse(stored) as CachedData;
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
    return isExpired ? null : data;
  } catch {
    return null;
  }
}

export function getCacheSize(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Blob([data]).size : 0;
  } catch {
    return 0;
  }
}

export function cleanupExpiredCaches() {
  if (typeof window === 'undefined') return;
  
  try {
    // Clean up our cache if expired
    const cached = getFromLocalStorage();
    if (!cached) {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    // Clean up other potential strava-related caches
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('strava_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          if (Date.now() - data.timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        } catch {
          // If we can't parse the data, remove it
          localStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up caches:', error);
  }
}

export function saveToLocalStorage(data: CachedData) {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheContent = JSON.stringify({ ...data, timestamp: Date.now() });
    const cacheSize = new Blob([cacheContent]).size;
    
    if (cacheSize > MAX_CACHE_SIZE) {
      console.warn('Cache size exceeds limit, not caching');
      return;
    }
    
    localStorage.setItem(STORAGE_KEY, cacheContent);
    cleanupExpiredCaches();
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

export function calculateCacheExpiry(timestamp: number): string {
  const timeLeft = timestamp + CACHE_DURATION - Date.now();
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
