"use client";

import { useEffect, useRef, useState } from "react";
import { CardBackground, ResumeData } from "@/types";
import { buildCardBackImage, buildCardImage, downloadCanvasPng } from "@/lib/buildCardImage";
import { buildVcard, downloadVcard } from "@/lib/buildVcard";
import { useToast } from "@/components/ui/toast";
import EventMode from "@/components/card/EventMode";

export default function QRShare({
  data,
  background,
  shareSlug,
}: {
  data: ResumeData;
  background: CardBackground;
  shareSlug: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [eventMode, setEventMode] = useState(false);
  const { toast } = useToast();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/card/${shareSlug ?? ""}`
      : "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = shareUrl || "https://voiceresume.app";
        const [front, back] = await Promise.all([
          buildCardImage(data, background, url),
          buildCardBackImage(data, background, url),
        ]);
        if (cancelled) return;
        canvasRef.current = front;
        backCanvasRef.current = back;
        front.className = "w-full rounded-2xl shadow-xl";
        back.className = "h-full w-full rounded-2xl shadow-xl";
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(front);
        }
        if (backContainerRef.current) {
          backContainerRef.current.innerHTML = "";
          backContainerRef.current.appendChild(back);
        }
        setReady(true);
      } catch {
        toast("Failed to render card", "error");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, background, shareSlug]);

  const shareCard = async () => {
    const vcf = new File(
      [buildVcard(data)],
      `${(data.name || "contact").replace(/\s+/g, "_")}.vcf`,
      { type: "text/vcard" }
    );
    if (navigator.share && navigator.canShare?.({ files: [vcf] })) {
      try {
        await navigator.share({
          title: `${data.name} — ${data.title}`,
          text: `Connect with ${data.name}`,
          files: [vcf],
        });
        return;
      } catch {
        /* user cancelled — fall through to download */
      }
    }
    downloadVcard(data);
  };

  const copyLink = async () => {
    if (!shareSlug) {
      toast("Card not saved yet", "error");
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    toast("Link copied ✓");
  };

  const saveImage = () => {
    const canvas = flipped ? backCanvasRef.current : canvasRef.current;
    if (canvas) {
      downloadCanvasPng(
        canvas,
        `${(data.name || "card").replace(/\s+/g, "_")}_card_${flipped ? "back" : "front"}.png`
      );
    }
  };

  const whatsapp = () => {
    const text = encodeURIComponent(
      `${data.name} — ${data.title}\n${data.contact?.email ?? ""} ${data.contact?.phone ?? ""}\n${shareSlug ? shareUrl : ""}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const openEventMode = () => {
    if (!shareSlug) {
      toast("Card not saved yet", "error");
      return;
    }
    setEventMode(true);
  };

  const options = [
    { icon: "🎪", label: "Event mode", onClick: openEventMode },
    { icon: "📤", label: "Share card", onClick: shareCard },
    { icon: "👤", label: "Save contact", onClick: () => downloadVcard(data) },
    { icon: "🔗", label: "Copy link", onClick: copyLink },
    { icon: "🖼", label: "Save image", onClick: saveImage },
    { icon: "💬", label: "WhatsApp", onClick: whatsapp },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Your card is <span className="g-text">ready</span> 🎉</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Scan the QR or share it anywhere.</p>
      </div>

      <div className="flip-scene">
        <button
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Show card front" : "Show card back"}
          className={`flip-inner block w-full text-left ${flipped ? "flipped" : ""}`}
        >
          <div ref={containerRef} className="flip-face" aria-label="Business card front">
            {!ready && (
              <div className="flex aspect-[7/4] w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                Rendering card…
              </div>
            )}
          </div>
          <div ref={backContainerRef} className="flip-face flip-back" aria-label="Business card back" />
        </button>
      </div>
      <p className="text-center font-caveat text-xl text-gray-400">
        tap the card to flip it over 🔄
      </p>

      {eventMode && shareSlug && (
        <EventMode
          data={data}
          shareSlug={shareSlug}
          shareUrl={shareUrl}
          onClose={() => setEventMode(false)}
        />
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        {options.map((o) => (
          <button
            key={o.label}
            onClick={o.onClick}
            aria-label={o.label}
            className="card-hover glass flex flex-col items-center gap-1.5 rounded-2xl py-4"
          >
            <span className="text-2xl" aria-hidden>
              {o.icon}
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
