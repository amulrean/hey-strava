import Image from "next/image";
import { StravaAthlete } from "@/types/strava";

interface AthleteInfoProps {
  athlete: StravaAthlete;
}

export function AthleteInfo({ athlete }: AthleteInfoProps) {
  return (
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
  );
}
