"use client";

import { getTemplate } from "@/lib/templates";

export default function AIRecommendBanner({
  templateId,
  reason,
  onApply,
}: {
  templateId: string;
  reason: string;
  onApply: () => void;
}) {
  const template = getTemplate(templateId);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950 p-4">
      <span className="sparkle text-2xl" aria-hidden>
        ✦
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
          AI pick: {template.name}
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300">{reason}</p>
      </div>
      <button
        onClick={onApply}
        aria-label={`Apply AI recommended template ${template.name}`}
        className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-400"
      >
        Use it
      </button>
    </div>
  );
}
