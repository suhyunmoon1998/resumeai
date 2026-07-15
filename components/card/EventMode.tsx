"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ResumeData } from "@/types";
import { createClient } from "@/lib/supabase/client";

type ThemeOption = {
  name: string;
  gradient: string;
  glowColor: string;
  icon: string;
};

const THEMES: Record<string, ThemeOption> = {
  vibrant: {
    name: "Vibrant",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
    glowColor: "rgba(240,147,251,0.4)",
    icon: "✨",
  },
  professional: {
    name: "Professional",
    gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7aa8d1 100%)",
    glowColor: "rgba(122,168,209,0.4)",
    icon: "💼",
  },
  warm: {
    name: "Warm",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #fbbf24 100%)",
    glowColor: "rgba(251,191,36,0.4)",
    icon: "🔥",
  },
  minimal: {
    name: "Minimal",
    gradient: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)",
    glowColor: "rgba(148,163,184,0.4)",
    icon: "⚫",
  },
  fresh: {
    name: "Fresh",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #0891b2 100%)",
    glowColor: "rgba(8,145,178,0.4)",
    icon: "🌿",
  },
  sunset: {
    name: "Sunset",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fbbf24 100%)",
    glowColor: "rgba(244,63,94,0.4)",
    icon: "🌅",
  },
};

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
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [theme, setTheme] = useState<keyof typeof THEMES>("vibrant");
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

  const currentTheme = THEMES[theme];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]"
      style={{
        background: currentTheme.gradient,
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite"
      }}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 60px rgba(240,147,251,0.2); }
          50% { box-shadow: 0 0 30px rgba(255,255,255,0.5), 0 0 80px rgba(240,147,251,0.4); }
        }
        @keyframes bounce-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] flex gap-2">
        <button
          onClick={() => setShowThemePicker(!showThemePicker)}
          aria-label="Theme picker"
          className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-bold text-gray-700 shadow-lg hover:bg-white transition-all"
        >
          🎨 Theme
        </button>
        <button
          onClick={onClose}
          aria-label="Exit event mode"
          className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-bold text-gray-700 shadow-lg hover:bg-white transition-all"
        >
          ✕ Close
        </button>
      </div>

      {/* Theme Picker */}
      {showThemePicker && (
        <div className="absolute left-4 top-[calc(1rem+env(safe-area-inset-top))] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 z-50">
          <p className="text-sm font-semibold text-gray-700 mb-3">Choose a theme</p>
          <div className="grid grid-cols-2 gap-2 min-w-max">
            {Object.entries(THEMES).map(([key, themeOption]) => (
              <button
                key={key}
                onClick={() => {
                  setTheme(key as keyof typeof THEMES);
                  setShowThemePicker(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === key
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{themeOption.icon}</span>
                <span>{themeOption.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 max-w-2xl">
        {/* User Info Section */}
        <div className="text-center text-white drop-shadow-lg">
          <h1 className="font-display text-5xl font-bold tracking-tight mb-2">
            {data.name}
          </h1>
          {data.title && (
            <p className="text-xl font-semibold text-white/90 mb-1">{data.title}</p>
          )}
          <p className="text-sm text-white/70">scan my card to connect</p>
        </div>

        {/* QR Code Card */}
        <div className="relative w-full max-w-[min(85vw,480px)]">
          {/* Animated border glow */}
          <div
            className="absolute inset-0 rounded-3xl blur-xl opacity-75"
            style={{
              background: `radial-gradient(circle, ${currentTheme.glowColor}, transparent)`,
              animation: "pulse-glow 3s ease-in-out infinite"
            }}
          />

          {/* Card container */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
            style={{ animation: "float-up 3s ease-in-out infinite" }}>
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrUrl}
                alt={`QR code for ${data.name}'s card`}
                className="w-full aspect-square rounded-2xl"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <span>Generating QR…</span>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <p className="font-caveat text-3xl text-white drop-shadow-lg animate-bounce">
          📱 scan me to connect!
        </p>

        {/* Live Counter */}
        <div
          className="mt-2 flex items-center gap-3 rounded-full bg-white/20 backdrop-blur-md px-6 py-3 text-white border border-white/30 shadow-xl"
          role="status"
          aria-live="polite"
        >
          <span className="text-2xl" aria-hidden>💌</span>
          <div className="flex flex-col items-start">
            <span
              className="font-display text-3xl font-bold"
              style={pop ? { animation: "bounce-pop 0.5s ease-out" } : {}}
            >
              {scans}
            </span>
            <span className="text-xs font-medium text-white/80 leading-none">
              {scans === 1 ? "connection" : "connections"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
