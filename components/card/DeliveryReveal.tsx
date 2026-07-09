"use client";

import { useEffect, useState } from "react";

type Phase = "sending" | "done" | "fading" | "hidden";

/**
 * Cute delivery overlay shown when someone scans a QR and lands on a card:
 * "Sending…" cloud with envelope → "Delivered!" pop → fades away to reveal the card.
 */
export default function DeliveryReveal() {
  const [phase, setPhase] = useState<Phase>("sending");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("hidden");
      return;
    }
    const t1 = setTimeout(() => setPhase("done"), 1800);
    const t2 = setTimeout(() => setPhase("fading"), 2800);
    const t3 = setTimeout(() => setPhase("hidden"), 3350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className={`delivery-overlay fixed inset-0 z-[80] flex flex-col items-center justify-center bg-gray-950 ${
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {phase === "sending" ? (
        <>
          <div className="delivery-cloud text-7xl">☁️</div>
          <div className="delivery-envelope -mt-2 text-5xl">📨</div>
          <p className="mt-6 font-caveat text-3xl text-amber-200">
            Sending this card to you
          </p>
          <div className="mt-3 flex gap-1.5">
            <span className="delivery-dot h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="delivery-dot h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="delivery-dot h-2.5 w-2.5 rounded-full bg-amber-400" />
          </div>
        </>
      ) : (
        <div className="delivery-pop flex flex-col items-center">
          <div className="text-7xl">💌</div>
          <p className="mt-4 font-caveat-brush text-5xl text-amber-300">Delivered!</p>
          <p className="mt-1 font-caveat text-2xl text-gray-400">say hello 👋</p>
        </div>
      )}
    </div>
  );
}
