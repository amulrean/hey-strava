'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StravaActivity } from "@/types/strava";
import { ActivityCard } from "./activity-card";

export function ActivitiesDashboard() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchActivities() {
      if (!session) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/activities?page=${page}&per_page=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data = await response.json();
        setActivities(current => page === 1 ? data : [...current, ...data]);
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

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Your Activities</h2>
      
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

      {activities.length > 0 && !loading && (
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
