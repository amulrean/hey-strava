'use client';

import { StravaActivity } from "@/types/strava";
import { formatDistance, formatDuration, formatPace } from "@/utils/strava";

interface ActivityCardProps {
  activity: StravaActivity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-[#FC4C02] transition-colors duration-200">
            {activity.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(activity.start_date_local).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          {activity.sport_type}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-6 my-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatDistance(activity.distance)}
          </span>
          <span className="text-xs text-gray-500 mt-1">Distance</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatDuration(activity.moving_time)}
          </span>
          <span className="text-xs text-gray-500 mt-1">Time</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatPace(activity.distance, activity.moving_time)}
          </span>
          <span className="text-xs text-gray-500 mt-1">Pace</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <svg className="shrink-0 w-[14px] h-[14px] text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1.75a6.25 6.25 0 100 12.5 6.25 6.25 0 000-12.5zM1.75 8a6.25 6.25 0 1112.5 0 6.25 6.25 0 01-12.5 0z" fill="currentColor"/>
            <path d="M8 5.25L5.5 6.75v2.5L8 10.75l2.5-1.5v-2.5L8 5.25z" fill="currentColor"/>
          </svg>
          <span className="text-xs text-gray-500">{activity.kudos_count} kudos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="shrink-0 w-[14px] h-[14px] text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3.5A1.5 1.5 0 014.5 2h7A1.5 1.5 0 0113 3.5v6a1.5 1.5 0 01-1.5 1.5h-1.25l-2.5 2.5-2.5-2.5H4.5A1.5 1.5 0 013 9.5v-6z" fill="currentColor"/>
          </svg>
          <span className="text-xs text-gray-500">{activity.comment_count} comments</span>
        </div>
      </div>
    </div>
  );
}
