import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getActivities } from "@/utils/strava";
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

    const activities = await getActivities(session, {
      page,
      per_page: perPage,
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return new NextResponse(
      "Error fetching activities", 
      { status: 500 }
    );
  }
}
