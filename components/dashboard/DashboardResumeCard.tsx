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
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold leading-tight text-gray-900">
            {resume.data?.name || resume.title}
          </h3>
          <p className="text-sm text-gray-500">{resume.data?.title}</p>
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
          className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
        >
          ⬇ Download
        </button>
        <button
          onClick={remove}
          aria-label={`Delete ${resume.title}`}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition hover:bg-gray-50"
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
