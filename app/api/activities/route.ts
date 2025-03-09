import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getActivities, getAthleteProfile } from "@/utils/strava";
import { authOptions } from "../auth/auth.config";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "10");
    const fetchAthlete = searchParams.get("include_athlete") === "true";

    const [activities, athlete] = await Promise.all([
      getActivities(session, {
        page,
        per_page: perPage,
      }),
      fetchAthlete ? getAthleteProfile(session) : null,
    ]);

    return NextResponse.json({
      activities,
      athlete: athlete || undefined,
      page,
      per_page: perPage,
      has_more: activities.length === perPage,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return new NextResponse(
      "Error fetching activities", 
      { status: 500 }
    );
  }
}
