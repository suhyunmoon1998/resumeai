"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ResumeData } from "@/types";
import { createClient } from "@/lib/supabase/client";

/**
 * Fullscreen QR for handing out your card at events: max-contrast QR,
 * screen kept awake, and a live counter that ticks up every time
 * someone scans the card while this screen is open.
 */
export default function EventMode({
  data,
  shareSlug,
  shareUrl,
  onClose,
}: {
  data: ResumeData;
  shareSlug: string;
  shareUrl: string;
  onClose: () => void;
}) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [scans, setScans] = useState(0);
  const [pop, setPop] = useState(false);
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null);

  // Big high-contrast QR
  useEffect(() => {
    QRCode.toDataURL(shareUrl, { width: 640, margin: 2 })
      .then(setQrUrl)
      .catch(() => setQrUrl(null));
  }, [shareUrl]);

  // Count scans live while the screen is open
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`event-mode-${shareSlug}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "cards", filter: `share_slug=eq.${shareSlug}` },
        () => {
          setScans((n) => n + 1);
          setPop(true);
          setTimeout(() => setPop(false), 550);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [shareSlug]);

  // Keep the screen on while showing the QR (best-effort)
  useEffect(() => {
    (async () => {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> };
        };
        wakeLock.current = (await nav.wakeLock?.request("screen")) ?? null;
      } catch {
        /* unsupported or denied — fine */
      }
    })();
    return () => {
      wakeLock.current?.release().catch(() => {});
    };
  }, []);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
      <button
        onClick={onClose}
        aria-label="Exit event mode"
        className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600"
      >
        ✕ Close
      </button>

      <p className="mb-1 font-display text-2xl font-bold tracking-tight text-gray-900">
        {data.name}
      </p>
      {data.title && <p className="mb-5 text-sm text-gray-500">{data.title}</p>}

      {qrUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrUrl}
          alt={`QR code for ${data.name}'s card`}
          className="w-full max-w-[min(78vw,420px)] rounded-2xl"
        />
      ) : (
        <div className="flex aspect-square w-full max-w-[min(78vw,420px)] items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          Generating QR…
        </div>
      )}

      <p className="mt-5 font-caveat text-2xl text-gray-500">scan me! 📲</p>

      <div
        className={`mt-4 flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2.5 text-emerald-700 ${
          pop ? "event-counter-pop" : ""
        }`}
        role="status"
        aria-live="polite"
      >
        <span className="text-xl" aria-hidden>💌</span>
        <span className="font-bold tabular-nums">{scans}</span>
        <span className="text-sm font-semibold">
          {scans === 1 ? "card delivered" : "cards delivered"}
        </span>
      </div>
    </div>
  );
}
