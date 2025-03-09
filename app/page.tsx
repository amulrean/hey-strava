import { AuthButton } from "./components/auth-button";
import { ActivitiesDashboard } from "./components/activities-dashboard";
import { BrandLogo } from "./components/brand-logo";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <BrandLogo size={36} />
        <AuthButton />
      </div>
      
      <ActivitiesDashboard />
    </main>
  );
}
