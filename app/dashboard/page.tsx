import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Profile, SavedResume, School } from "@/types";
import { getTemplate } from "@/lib/templates";
import DashboardResumeCard from "@/components/dashboard/DashboardResumeCard";
import SchoolPicker from "@/components/school/SchoolPicker";
import SignOutButton from "@/components/auth/SignOutButton";
import ThemeToggle from "@/components/theme/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
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
  const firstName = (profile?.full_name || user.email || "").split(" ")[0];

  return (
    <main className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="glass mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-5 py-3 shadow-sm">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
            <span aria-hidden>☁️</span> VoiceResume
          </Link>
          <div className="flex items-center gap-4">
            {school && (
              <span className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 sm:inline-flex">
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
              <span className="g-bg inline-flex rounded-full p-[2px]">
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "avatar"}
                  className="h-8 w-8 rounded-full"
                />
              </span>
            )}
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="font-caveat text-2xl text-violet-500">Hey {firstName} 👋</p>
        <div className="mb-8 mt-1 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            My resumes
          </h1>
          <Link
            href="/interview"
            aria-label="Create a new resume"
            className="g-bg glow-btn inline-flex h-11 items-center rounded-xl px-5 text-sm font-bold text-white"
          >
            + New Resume
          </Link>
        </div>

        {!school && (
          <section className="glass card-hover mb-10 rounded-3xl p-6">
            <h2 className="mb-1 font-display text-lg font-bold text-gray-900 dark:text-gray-100">
              Pick your school or company 🎓
            </h2>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Your business card background uses its official colors.
            </p>
            <SchoolPicker />
          </section>
        )}

        {resumes.length === 0 ? (
          <div className="glass rounded-3xl py-20 text-center">
            <div className="mb-3 text-5xl" aria-hidden>
              ☁️
            </div>
            <p className="font-display font-semibold text-gray-600 dark:text-gray-300">No resumes yet.</p>
            <p className="mt-1 text-sm text-gray-400">
              Start a voice interview and watch your resume write itself.
            </p>
            <Link
              href="/interview"
              className="g-bg glow-btn mt-6 inline-flex h-11 items-center rounded-xl px-6 text-sm font-bold text-white"
            >
              🎙 Start talking
            </Link>
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
