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
    <div className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50 p-4">
      <span className="sparkle text-2xl" aria-hidden>
        ✦
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold text-violet-900">
          AI pick: {template.name}
        </p>
        <p className="text-xs text-violet-600">{reason}</p>
      </div>
      <button
        onClick={onApply}
        aria-label={`Apply AI recommended template ${template.name}`}
        className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-500"
      >
        Use it
      </button>
    </div>
  );
}
