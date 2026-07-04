"use client";

import { TEMPLATES } from "@/lib/templates";
import AIRecommendBanner from "@/components/resume/AIRecommendBanner";

const LAYOUT_BADGE: Record<string, string> = {
  single: "1-column",
  skills: "Skills first",
  sidebar: "Sidebar",
};

export default function StylePicker({
  selected,
  recommendation,
  onSelect,
}: {
  selected: string;
  recommendation: { templateId: string; reason: string } | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-10">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Pick a <span className="g-text">style</span></h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">All 10 templates export to DOCX.</p>
      </div>

      {recommendation && (
        <AIRecommendBanner
          templateId={recommendation.templateId}
          reason={recommendation.reason}
          onApply={() => onSelect(recommendation.templateId)}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            aria-label={`Choose template ${t.name}`}
            className={`card-hover flex flex-col overflow-hidden rounded-2xl border-2 bg-white/80 text-left ${
              selected === t.id
                ? "border-violet-500 ring-2 ring-violet-200"
                : "border-gray-200"
            }`}
          >
            <div className="h-20 w-full" style={{ background: t.bg }}>
              <div className="flex h-full items-end p-3">
                <div className="h-2 w-2/3 rounded bg-white/60" />
              </div>
            </div>
            <div className="space-y-1.5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">{t.name}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: t.tagBg, color: t.tagTx }}
                >
                  {t.tag}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</p>
              <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                {LAYOUT_BADGE[t.layout]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
