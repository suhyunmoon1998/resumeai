import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Profile, SavedResume, School } from "@/types";
import { getTemplate } from "@/lib/templates";
import DashboardResumeCard from "@/components/dashboard/DashboardResumeCard";
import SchoolPicker from "@/components/school/SchoolPicker";
import SignOutButton from "@/components/auth/SignOutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profileRow }, { data: resumeRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, school:schools(*)")
      .eq("id", user.id)
      .single(),
    supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileRow as (Profile & { school: School | null }) | null;
  const resumes = (resumeRows as SavedResume[]) ?? [];
  const school = profile?.school ?? null;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-caveat-brush text-2xl text-gray-900">
            ☁️ VoiceResume
          </Link>
          <div className="flex items-center gap-4">
            {school && (
              <span className="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 sm:inline-flex">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: school.colors?.primary ?? "#999" }}
                />
                {school.short_name || school.name}
                {profile?.is_graduated && profile?.graduation_year
                  ? ` '${String(profile.graduation_year).slice(-2)}`
                  : ""}
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "avatar"}
                className="h-9 w-9 rounded-full border border-gray-200"
              />
            )}
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {profile?.full_name || user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {!school && (
          <section className="mb-10 rounded-2xl border border-dashed border-gray-300 bg-white p-6">
            <h2 className="mb-1 text-lg font-bold text-gray-900">
              Pick your school or company 🎓
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Your business card background uses its official colors.
            </p>
            <SchoolPicker />
          </section>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My resumes</h1>
          <Link
            href="/interview"
            aria-label="Create a new resume"
            className="inline-flex h-11 items-center rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            + New Resume
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <div className="mb-3 text-5xl" aria-hidden>
              ☁️
            </div>
            <p className="text-gray-500">No resumes yet.</p>
            <p className="text-sm text-gray-400">
              Start a voice interview and watch your resume write itself.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r) => (
              <DashboardResumeCard
                key={r.id}
                resume={r}
                templateName={getTemplate(r.template_id).name}
                accent={getTemplate(r.template_id).accent}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
