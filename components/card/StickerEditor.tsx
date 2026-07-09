"use client";

import { useEffect, useRef, useState } from "react";
import { CardBackground, CardPhoto, CardSticker } from "@/types";
import { drawSchoolBackground } from "@/lib/buildCardImage";
import { getCardStyle } from "@/lib/templates";

const PALETTE = [
  "⭐", "❤️", "🔥", "✨", "🌈", "🎓",
  "☁️", "😎", "🍀", "🎵", "🚀", "🌸",
];

/** Downscale an uploaded image to keep the stored data URL small. */
function fileToDataUrl(file: File, maxDim = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

type Selection = number | "photo" | null;

/**
 * Decorate the card: drag-and-drop emoji stickers and an optional circular
 * profile photo over the chosen background. Positions are stored as 0–1
 * fractions so buildCardImage reproduces them on the final 1050×600 canvas.
 */
export default function StickerEditor({
  background,
  stickers,
  photo,
  onChange,
  onPhotoChange,
}: {
  background: CardBackground;
  stickers: CardSticker[];
  photo: CardPhoto | null;
  onChange: (stickers: CardSticker[]) => void;
  onPhotoChange: (photo: CardPhoto | null) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Selection>(null);
  const dragging = useRef<Selection>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#111111");
  const [boxWidth, setBoxWidth] = useState(360);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    ro.observe(el);
    setBoxWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Render a lightweight preview of the current background
  useEffect(() => {
    if (background.type === "drawn" && background.dataUrl) {
      setBgUrl(background.dataUrl);
      return;
    }
    if (background.type === "school" && background.colors) {
      const c = document.createElement("canvas");
      c.width = 525;
      c.height = 300;
      const ctx = c.getContext("2d");
      if (ctx) {
        drawSchoolBackground(
          ctx, 525, 300,
          background.colors.primary,
          background.colors.secondary,
          background.bgStyle ?? "minimal",
          background.watermark,
          background.pattern
        );
        setBgUrl(c.toDataURL());
      }
      return;
    }
    setBgUrl(null);
    setBgColor(background.color ?? getCardStyle(background.styleId ?? "c1").bg);
  }, [background]);

  const addSticker = (emoji: string) => {
    const next: CardSticker = {
      emoji,
      x: 0.4 + Math.random() * 0.2,
      y: 0.35 + Math.random() * 0.3,
      size: 0.1,
      rot: Math.round((Math.random() - 0.5) * 30),
    };
    onChange([...stickers, next]);
    setSelected(stickers.length);
  };

  const uploadPhoto = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      onPhotoChange({ dataUrl, x: 0.62, y: 0.32, size: 0.22 });
      setSelected("photo");
    } catch {
      /* unreadable image — ignore */
    }
  };

  const updateSticker = (patch: Partial<CardSticker>) => {
    if (typeof selected !== "number") return;
    onChange(stickers.map((s, i) => (i === selected ? { ...s, ...patch } : s)));
  };

  const removeSelected = () => {
    if (selected === "photo") {
      onPhotoChange(null);
    } else if (typeof selected === "number") {
      onChange(stickers.filter((_, i) => i !== selected));
    }
    setSelected(null);
  };

  const grab = (target: Selection) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = target;
    setSelected(target);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current === null || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = Math.min(0.97, Math.max(0.03, (e.clientX - rect.left) / rect.width));
    const y = Math.min(0.95, Math.max(0.05, (e.clientY - rect.top) / rect.height));
    if (dragging.current === "photo") {
      if (photo) onPhotoChange({ ...photo, x, y });
    } else {
      const idx = dragging.current;
      onChange(stickers.map((s, i) => (i === idx ? { ...s, x, y } : s)));
    }
  };

  const onPointerUp = () => {
    dragging.current = null;
  };

  const sel = typeof selected === "number" ? stickers[selected] : null;

  return (
    <div className="space-y-3">
      <p className="text-center font-caveat text-2xl text-gray-700 dark:text-gray-300">
        Sticker time! 🌟 <span className="text-lg text-gray-400">tap to add · drag to move</span>
      </p>

      {/* Palette + photo upload */}
      <div className="flex flex-wrap justify-center gap-1.5">
        <button
          onClick={() => fileRef.current?.click()}
          aria-label="Add a profile photo"
          className="card-hover glass flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-bold text-gray-700 dark:text-gray-300"
        >
          📷 {photo ? "Change photo" : "Add photo"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-hidden
          onChange={(e) => uploadPhoto(e.target.files?.[0])}
        />
        {PALETTE.map((emoji) => (
          <button
            key={emoji}
            onClick={() => addSticker(emoji)}
            aria-label={`Add sticker ${emoji}`}
            className="card-hover glass flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Preview with draggable photo + stickers */}
      <div
        ref={boxRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative aspect-[7/4] w-full touch-none select-none overflow-hidden rounded-2xl shadow-inner"
        style={
          bgUrl
            ? { backgroundImage: `url(${bgUrl})`, backgroundSize: "cover" }
            : { background: bgColor }
        }
        aria-label="Card decoration preview"
      >
        {stickers.length === 0 && !photo && (
          <p className="absolute inset-0 flex items-center justify-center font-caveat text-2xl text-white/60">
            your photo &amp; stickers go here ✨
          </p>
        )}

        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.dataUrl}
            alt="Profile photo on card"
            onPointerDown={grab("photo")}
            draggable={false}
            className={`absolute cursor-grab rounded-full border-2 border-white object-cover shadow-lg active:cursor-grabbing ${
              selected === "photo" ? "ring-4 ring-amber-400/80" : ""
            }`}
            style={{
              left: `${photo.x * 100}%`,
              top: `${photo.y * 100}%`,
              width: `${Math.round(photo.size * boxWidth)}px`,
              height: `${Math.round(photo.size * boxWidth)}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {stickers.map((s, i) => (
          <span
            key={i}
            onPointerDown={grab(i)}
            role="button"
            aria-label={`Sticker ${s.emoji}`}
            className={`absolute cursor-grab leading-none active:cursor-grabbing ${
              selected === i ? "drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]" : ""
            }`}
            style={{
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              fontSize: `${Math.round(s.size * boxWidth)}px`,
              transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            }}
          >
            {s.emoji}
          </span>
        ))}
      </div>

      {/* Selected item toolbar */}
      {(sel || selected === "photo") && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-white/70 px-3 py-2 dark:bg-gray-800/70">
          <span className="text-xl" aria-hidden>
            {selected === "photo" ? "📷" : sel?.emoji}
          </span>
          <button
            onClick={() =>
              selected === "photo"
                ? photo && onPhotoChange({ ...photo, size: Math.min(0.45, photo.size + 0.03) })
                : sel && updateSticker({ size: Math.min(0.3, sel.size + 0.02) })
            }
            aria-label="Bigger"
            className="rounded-lg bg-white px-2.5 py-1 text-sm font-bold shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            ➕
          </button>
          <button
            onClick={() =>
              selected === "photo"
                ? photo && onPhotoChange({ ...photo, size: Math.max(0.1, photo.size - 0.03) })
                : sel && updateSticker({ size: Math.max(0.04, sel.size - 0.02) })
            }
            aria-label="Smaller"
            className="rounded-lg bg-white px-2.5 py-1 text-sm font-bold shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            ➖
          </button>
          {sel && (
            <button
              onClick={() => updateSticker({ rot: sel.rot + 15 })}
              aria-label="Rotate sticker"
              className="rounded-lg bg-white px-2.5 py-1 text-sm font-bold shadow-sm dark:bg-gray-700 dark:text-gray-200"
            >
              🔄
            </button>
          )}
          <button
            onClick={removeSelected}
            aria-label="Remove"
            className="rounded-lg bg-red-100 px-2.5 py-1 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/50 dark:text-red-300"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}
