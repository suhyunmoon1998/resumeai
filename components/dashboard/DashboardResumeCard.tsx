"use client";

import { useRouter } from "next/navigation";
import { SavedResume } from "@/types";
import { getTemplate } from "@/lib/templates";
import { downloadDocx } from "@/lib/buildDocx";
import { useToast } from "@/components/ui/toast";

export default function DashboardResumeCard({
  resume,
  templateName,
  accent,
}: {
  resume: SavedResume;
  templateName: string;
  accent: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const download = async () => {
    try {
      await downloadDocx(resume.data, getTemplate(resume.template_id));
      toast("Resume downloaded ✓");
    } catch {
      toast("Download failed", "error");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this resume?")) return;
    const res = await fetch("/api/resume", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: resume.id }),
    });
    if (res.ok) {
      toast("Resume deleted");
      router.refresh();
    } else {
      toast("Delete failed", "error");
    }
  };

  return (
    <div className="card-hover glass flex flex-col rounded-3xl p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold leading-tight text-gray-900 dark:text-gray-100">
            {resume.data?.name || resume.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{resume.data?.title}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
          style={{ background: accent }}
        >
          {templateName}
        </span>
      </div>
      <p className="mb-4 line-clamp-2 text-xs text-gray-400">
        {resume.data?.summary}
      </p>
      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={download}
          aria-label={`Download ${resume.title} as DOCX`}
          className="g-bg flex-1 rounded-lg px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
        >
          ⬇ Download
        </button>
        <button
          onClick={remove}
          aria-label={`Delete ${resume.title}`}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 transition hover:bg-gray-50"
        >
          🗑
        </button>
      </div>
      <p className="mt-3 text-[11px] text-gray-300">
        {new Date(resume.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
