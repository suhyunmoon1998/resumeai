import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CompanyMap from "@/components/map/CompanyMap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Companies near me — VoiceResume",
};

export default async function MapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <main className="mesh-bg min-h-dvh">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="glass rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            ← Dashboard
          </Link>
          <h1 className="font-caveat-brush text-3xl text-gray-900 dark:text-gray-100">
            Companies near me 🗺️
          </h1>
        </div>
        <CompanyMap />
      </div>
    </main>
  );
}
