"use client";

import { useEffect, useRef, useState } from "react";
import { CardBackground, ResumeData, SavedCard } from "@/types";
import { buildCardImage } from "@/lib/buildCardImage";
import { downloadVcard } from "@/lib/buildVcard";

export default function PublicCardView({
  card,
  resumeData,
}: {
  card: SavedCard;
  resumeData: ResumeData | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!resumeData) return;
    let cancelled = false;
    (async () => {
      try {
        const bg: CardBackground =
          card.background_data ?? { type: "preset", styleId: card.style_id };
        const canvas = await buildCardImage(
          resumeData,
          bg,
          `${window.location.origin}/card/${card.share_slug}`
        );
        if (cancelled) return;
        canvas.className = "w-full rounded-2xl shadow-2xl";
        const el = containerRef.current;
        if (el) {
          el.innerHTML = "";
          el.appendChild(canvas);
        }
        setRendered(true);
      } catch {
        setRendered(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [card, resumeData]);

  if (!resumeData) {
    return (
      <div className="text-center text-gray-400">
        <p className="text-5xl" aria-hidden>📇</p>
        <p className="mt-4">This card is no longer available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <div ref={containerRef} aria-label={`Business card of ${resumeData.name}`}>
        {!rendered && (
          <div className="flex aspect-[7/4] w-full items-center justify-center rounded-2xl bg-gray-800 text-gray-500">
            Loading card…
          </div>
        )}
      </div>
      <button
        onClick={() => downloadVcard(resumeData)}
        aria-label={`Save ${resumeData.name} to contacts`}
        className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-gray-900 transition hover:bg-gray-200"
      >
        👤 Save contact (.vcf)
      </button>
    </div>
  );
}
