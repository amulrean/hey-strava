import { StravaActivity } from "@/types/strava";
import { ActivityCard } from "./activity-card";

interface ActivityListProps {
  activities: StravaActivity[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
}

export function ActivityList({ activities, loading, hasMore, error, onLoadMore }: ActivityListProps) {
  if (error) {
    return (
      <div className="p-4 mb-4 text-red-600 border border-red-200 bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="border rounded divide-y">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {activities.length > 0 && !loading && hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={onLoadMore}
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
    </>
  );
}
