"use client";

import Link from "next/link";
import { SavedResume } from "@/types";
import { getTemplate } from "@/lib/templates";
import { downloadDocx } from "@/lib/buildDocx";
import { useToast } from "@/components/ui/toast";

const ROLE_MODE: Record<string, { badge: string; line: string }> = {
  student: { badge: "🎓 Academic mode", line: "Built for applications, internships & scholarships." },
  scientist: { badge: "🔬 Research mode", line: "Built for labs, grants & publications." },
  dev: { badge: "💼 Career mode", line: "Built for your next engineering role." },
  designer: { badge: "💼 Career mode", line: "Built for your next design role." },
  marketer: { badge: "💼 Career mode", line: "Built for your next marketing role." },
  executive: { badge: "💼 Career mode", line: "Built for leadership opportunities." },
  creative: { badge: "💼 Career mode", line: "Built for your next creative gig." },
  athlete: { badge: "🏆 Competition mode", line: "Built for teams, sponsors & recruiters." },
};

const DEFAULT_MODE = { badge: "💼 Career mode", line: "Built for whatever comes next." };

/** Personalized home hero — always reflects the user's most recent resume. */
export default function LatestResumeHero({ resume }: { resume: SavedResume }) {
  const { toast } = useToast();
  const template = getTemplate(resume.template_id);
  const mode = ROLE_MODE[resume.role_type] ?? DEFAULT_MODE;
  const data = resume.data;

  const download = async () => {
    try {
      await downloadDocx(data, template);
      toast("Resume downloaded ✓");
    } catch {
      toast("Download failed", "error");
    }
  };

  return (
    <section className="card-hover glass mb-10 overflow-hidden rounded-3xl">
      <div className="px-7 py-5 text-white" style={{ background: template.accent }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-caveat text-xl opacity-90">{mode.badge}</p>
            <h2 className="font-caveat-brush text-4xl leading-tight">
              {data?.name || resume.title}
            </h2>
            <p className="text-sm opacity-90">{data?.title}</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold">
            {template.name} · saved ✓
          </span>
        </div>
      </div>

      <div className="space-y-4 px-7 py-5">
        {data?.summary && (
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{data.summary}</p>
        )}
        {data?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.skills.slice(0, 6).map((s, i) => (
              <span
                key={i}
                className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                style={{ background: template.accent }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <p className="font-caveat text-lg text-gray-400">{mode.line}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={download}
            aria-label="Download latest resume as DOCX"
            className="g-bg glow-btn rounded-xl px-5 py-2.5 text-sm font-bold text-white"
          >
            ⬇ Download DOCX
          </button>
          <Link
            href="/interview"
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            🎙 New interview
          </Link>
        </div>
      </div>
    </section>
  );
}
