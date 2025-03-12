'use client';

import { useSession } from "next-auth/react";
import Image from "next/image";
import { ActivityList } from "./activity-list";
import { useStravaActivities } from "../hooks/useStravaActivities";
import { getCacheSize } from "@/utils/cache";

export function ActivitiesDashboard() {
  const { data: session } = useSession();
  const {
    activities,
    athlete,
    loading,
    error,
    hasMore,
    cacheInfo,
    refresh,
    loadMore,
    clearCache,
  } = useStravaActivities(session);

  if (!session) {
    return null;
  }

  return (
    <div>
      {athlete && (
        <div className="flex items-center gap-4 p-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="relative w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
            <Image
              src={athlete.profile_medium}
              alt={`${athlete.firstname} ${athlete.lastname}`}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium text-gray-900">
              {athlete.firstname} {athlete.lastname}
            </h2>
            <p className="text-sm text-gray-500">
              {[athlete.city, athlete.state, athlete.country]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      )}

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
                onClick={clearCache}
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
              onClick={refresh}
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
      
      <ActivityList
        activities={activities}
        loading={loading}
        hasMore={hasMore}
        error={error}
        onLoadMore={loadMore}
      />
    </div>
  );
}
