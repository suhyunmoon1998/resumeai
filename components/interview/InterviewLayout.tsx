"use client";

import { useState } from "react";

/**
 * Split layout: phone UI on the left, resume panel on the right.
 * On mobile the resume panel slides in as an overlay via a floating button.
 */
export default function InterviewLayout({
  phone,
  panel,
}: {
  phone: React.ReactNode;
  panel: React.ReactNode;
}) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="mesh-bg flex min-h-dvh">
      {/* Phone UI — full-bleed card on mobile, phone bezel on desktop */}
      <div className="flex w-full flex-col items-center justify-center px-3 py-4 md:w-1/2 md:px-4 md:py-8">
        <div className="w-full max-w-sm rounded-3xl md:g-bg md:w-auto md:rounded-[2.75rem] md:p-[3px] md:shadow-2xl">
          <div className="flex min-h-[78dvh] w-full max-w-sm flex-col items-center rounded-3xl bg-white/95 px-5 py-6 dark:bg-gray-900/95 md:min-h-[620px] md:rounded-[2.6rem] md:px-6 md:py-10">
            {phone}
          </div>
        </div>
      </div>

      {/* Resume panel — desktop */}
      <div className="hidden w-1/2 p-6 md:block">
        <div className="h-full max-h-[calc(100vh-3rem)]">{panel}</div>
      </div>

      {/* Resume panel — mobile overlay */}
      <button
        onClick={() => setShowPanel(true)}
        aria-label="Preview resume"
        className="g-bg glow-btn fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 rounded-full px-5 py-3.5 text-sm font-bold text-white md:hidden"
      >
        Preview →
      </button>
      {showPanel && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setShowPanel(false)}>
          <div
            className="absolute inset-y-0 right-0 w-[88%] bg-gray-50 p-4 dark:bg-gray-950"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPanel(false)}
              aria-label="Close resume preview"
              className="mb-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 shadow dark:bg-gray-800 dark:text-gray-300"
            >
              ← Back
            </button>
            <div className="h-[calc(100%-3rem)]">{panel}</div>
          </div>
        </div>
      )}
    </div>
  );
}
