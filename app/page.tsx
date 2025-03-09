import { AuthButton } from "./components/auth-button";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">HeyStrava</h1>
          <AuthButton />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to HeyStrava
          </h2>
          <p className="text-gray-600">
            Connect with your Strava account to view your activities, track your progress,
            and analyze your performance.
          </p>
        </div>
      </div>
    </main>
  );
}
