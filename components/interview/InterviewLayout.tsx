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
    <div className="flex min-h-screen bg-gray-50">
      {/* Phone UI */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-8 md:w-1/2">
        <div className="flex w-full max-w-sm flex-col items-center rounded-[2.5rem] border-8 border-gray-900 bg-white px-6 py-10 shadow-2xl" style={{ minHeight: 620 }}>
          {phone}
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
        className="fixed bottom-5 right-5 z-40 rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-xl md:hidden"
      >
        Preview →
      </button>
      {showPanel && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setShowPanel(false)}>
          <div
            className="absolute inset-y-0 right-0 w-[88%] bg-gray-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPanel(false)}
              aria-label="Close resume preview"
              className="mb-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 shadow"
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
