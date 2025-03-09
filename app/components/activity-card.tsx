'use client';

import { StravaActivity } from "@/types/strava";
import { formatDistance, formatDuration, formatPace } from "@/utils/strava";

interface ActivityCardProps {
  activity: StravaActivity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{activity.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(activity.start_date_local).toLocaleDateString()}
          </p>
        </div>
        <span className="text-sm text-gray-600">
          {activity.sport_type}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 my-2 text-sm">
        <div>
          <span className="text-gray-500">Distance:</span>{' '}
          <span>{formatDistance(activity.distance)}</span>
        </div>
        <div>
          <span className="text-gray-500">Time:</span>{' '}
          <span>{formatDuration(activity.moving_time)}</span>
        </div>
        <div>
          <span className="text-gray-500">Pace:</span>{' '}
          <span>{formatPace(activity.distance, activity.moving_time)}</span>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-500">
        <div>
          {activity.kudos_count} kudos
        </div>
        <div>
          {activity.comment_count} comments
        </div>
      </div>
    </div>
  );
}
