"use client";

import { useEffect, useRef, useState } from "react";
import { CardBackground, CardSticker } from "@/types";
import { drawSchoolBackground } from "@/lib/buildCardImage";
import { getCardStyle } from "@/lib/templates";

const PALETTE = [
  "⭐", "❤️", "🔥", "✨", "🌈", "🎓",
  "☁️", "😎", "🍀", "🎵", "🚀", "🌸",
];

/**
 * Drag-and-drop emoji stickers over the chosen card background.
 * Positions are stored as 0–1 fractions so buildCardImage can
 * reproduce them exactly on the final 1050×600 canvas.
 */
export default function StickerEditor({
  background,
  stickers,
  onChange,
}: {
  background: CardBackground;
  stickers: CardSticker[];
  onChange: (stickers: CardSticker[]) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const dragging = useRef<number | null>(null);
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

  const updateSelected = (patch: Partial<CardSticker>) => {
    if (selected === null) return;
    onChange(stickers.map((s, i) => (i === selected ? { ...s, ...patch } : s)));
  };

  const removeSelected = () => {
    if (selected === null) return;
    onChange(stickers.filter((_, i) => i !== selected));
    setSelected(null);
  };

  const onPointerDown = (index: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = index;
    setSelected(index);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current === null || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = Math.min(0.97, Math.max(0.03, (e.clientX - rect.left) / rect.width));
    const y = Math.min(0.95, Math.max(0.05, (e.clientY - rect.top) / rect.height));
    onChange(
      stickers.map((s, i) => (i === dragging.current ? { ...s, x, y } : s))
    );
  };

  const onPointerUp = () => {
    dragging.current = null;
  };

  const sel = selected !== null ? stickers[selected] : null;

  return (
    <div className="space-y-3">
      <p className="text-center font-caveat text-2xl text-gray-700 dark:text-gray-300">
        Sticker time! 🌟 <span className="text-lg text-gray-400">tap to add · drag to move</span>
      </p>

      {/* Palette */}
      <div className="flex flex-wrap justify-center gap-1.5">
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

      {/* Preview with draggable stickers */}
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
        aria-label="Sticker placement preview"
      >
        {stickers.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center font-caveat text-2xl text-white/60">
            your stickers go here ✨
          </p>
        )}
        {stickers.map((s, i) => (
          <span
            key={i}
            onPointerDown={onPointerDown(i)}
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

      {/* Selected sticker toolbar */}
      {sel && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-white/70 px-3 py-2 dark:bg-gray-800/70">
          <span className="text-xl" aria-hidden>{sel.emoji}</span>
          <button
            onClick={() => updateSelected({ size: Math.min(0.3, sel.size + 0.02) })}
            aria-label="Bigger sticker"
            className="rounded-lg bg-white px-2.5 py-1 text-sm font-bold shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            ➕
          </button>
          <button
            onClick={() => updateSelected({ size: Math.max(0.04, sel.size - 0.02) })}
            aria-label="Smaller sticker"
            className="rounded-lg bg-white px-2.5 py-1 text-sm font-bold shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            ➖
          </button>
          <button
            onClick={() => updateSelected({ rot: sel.rot + 15 })}
            aria-label="Rotate sticker"
            className="rounded-lg bg-white px-2.5 py-1 text-sm font-bold shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            🔄
          </button>
          <button
            onClick={removeSelected}
            aria-label="Remove sticker"
            className="rounded-lg bg-red-100 px-2.5 py-1 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/50 dark:text-red-300"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}
