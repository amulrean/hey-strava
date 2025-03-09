'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-gray-600">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <img
          src={session.user?.image || ''}
          alt={session.user?.name || 'Profile'}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-gray-700">{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("strava")}
      className="px-4 py-2 text-sm text-white bg-orange-500 rounded hover:bg-orange-600"
    >
      Sign in with Strava
    </button>
  );
}
