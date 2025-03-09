'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={session.user?.image || ''}
          alt={session.user?.name || 'Profile'}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm">{session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("strava")}
      className="text-sm border px-3 py-1 hover:bg-gray-50"
    >
      Sign in with Strava
    </button>
  );
}
