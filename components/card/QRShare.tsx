"use client";

import { useEffect, useRef, useState } from "react";
import { CardBackground, ResumeData } from "@/types";
import { buildCardImage, downloadCanvasPng } from "@/lib/buildCardImage";
import { buildVcard, downloadVcard } from "@/lib/buildVcard";
import { useToast } from "@/components/ui/toast";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/card/${shareSlug ?? ""}`
      : "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const canvas = await buildCardImage(data, background, shareUrl || "https://voiceresume.app");
        if (cancelled) return;
        canvasRef.current = canvas;
        canvas.className = "w-full rounded-2xl shadow-xl";
        const el = containerRef.current;
        if (el) {
          el.innerHTML = "";
          el.appendChild(canvas);
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
    if (canvasRef.current) {
      downloadCanvasPng(
        canvasRef.current,
        `${(data.name || "card").replace(/\s+/g, "_")}_card.png`
      );
    }
  };

  const whatsapp = () => {
    const text = encodeURIComponent(
      `${data.name} — ${data.title}\n${data.contact?.email ?? ""} ${data.contact?.phone ?? ""}\n${shareSlug ? shareUrl : ""}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const options = [
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

      <div ref={containerRef} aria-label="Business card preview">
        {!ready && (
          <div className="flex aspect-[7/4] w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
            Rendering card…
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
