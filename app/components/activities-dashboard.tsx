'use client';

import { useSession } from "next-auth/react";
import { ActivityList } from "./activity-list";
import { AthleteInfo } from "./athlete-info";
import { CacheControls } from "./cache-controls";
import { useStravaActivities } from "../hooks/useStravaActivities";

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
      {athlete && <AthleteInfo athlete={athlete} />}

      <div className="space-y-4">
        <CacheControls
          cacheInfo={cacheInfo}
          loading={loading}
          onRefresh={refresh}
          onClearCache={clearCache}
        />
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
