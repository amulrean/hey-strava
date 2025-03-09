import { Session } from "next-auth";
import { StravaActivity, StravaAthlete } from "@/types/strava";

const STRAVA_API_URL = "https://www.strava.com/api/v3";

export class StravaApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "StravaApiError";
  }
}

async function fetchFromStrava<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${STRAVA_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new StravaApiError(
      `Strava API error: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export async function getAthleteProfile(
  session: Session
): Promise<StravaAthlete> {
  if (!session?.accessToken) {
    throw new StravaApiError("No access token available");
  }

  return fetchFromStrava<StravaAthlete>(
    "/athlete",
    session.accessToken
  );
}

export async function getActivities(
  session: Session,
  params: {
    page?: number;
    per_page?: number;
    before?: number;
    after?: number;
  } = {}
): Promise<StravaActivity[]> {
  if (!session?.accessToken) {
    throw new StravaApiError("No access token available");
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  return fetchFromStrava<StravaActivity[]>(
    `/athlete/activities?${searchParams.toString()}`,
    session.accessToken
  );
}

export async function getActivity(
  session: Session,
  activityId: number
): Promise<StravaActivity> {
  if (!session?.accessToken) {
    throw new StravaApiError("No access token available");
  }

  return fetchFromStrava<StravaActivity>(
    `/activities/${activityId}`,
    session.accessToken
  );
}

export function formatDistance(meters: number): string {
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(2)} km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatPace(meters: number, seconds: number): string {
  const kilometersPerHour = (meters / 1000) / (seconds / 3600);
  return `${kilometersPerHour.toFixed(1)} km/h`;
}
