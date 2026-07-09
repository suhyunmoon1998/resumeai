"use client";

import { useState } from "react";
import { CARD_STYLES } from "@/lib/templates";
import { CardBackground, CardPhoto, CardSticker, School } from "@/types";
import SchoolBackground from "@/components/card/SchoolBackground";
import DrawCanvas from "@/components/card/DrawCanvas";
import StickerEditor from "@/components/card/StickerEditor";

type Mode = "preset" | "school" | "draw" | "sticker";

export default function CardPicker({
  defaultSchool,
  background,
  onChange,
  onDone,
}: {
  defaultSchool: School | null;
  background: CardBackground;
  onChange: (bg: CardBackground) => void;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<Mode>("preset");
  const [stickers, setStickers] = useState<CardSticker[]>(background.stickers ?? []);
  const [photo, setPhoto] = useState<CardPhoto | null>(background.photo ?? null);

  // Background changes keep the decorations; decoration changes keep the background.
  const setBackground = (bg: CardBackground) =>
    onChange({ ...bg, stickers, photo: photo ?? undefined });
  const updateStickers = (next: CardSticker[]) => {
    setStickers(next);
    onChange({ ...background, stickers: next, photo: photo ?? undefined });
  };
  const updatePhoto = (next: CardPhoto | null) => {
    setPhoto(next);
    onChange({ ...background, stickers, photo: next ?? undefined });
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Design your <span className="g-text">card</span>
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Pick a background, then decorate it with stickers.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            ["preset", "🎨 Presets"],
            ["school", "🎓 School colors"],
            ["draw", "✏️ Draw"],
            ["sticker", "🌟 Photo & stickers"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-label={`Card background mode: ${label}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === m
                ? "g-bg text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {label}
            {m === "sticker" && stickers.length > 0 ? ` (${stickers.length})` : ""}
          </button>
        ))}
      </div>

      {mode === "preset" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CARD_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() =>
                setBackground({ type: "preset", styleId: s.id, color: s.bg })
              }
              aria-label={`Card style ${s.name}`}
              className={`overflow-hidden rounded-2xl border-2 transition hover:-translate-y-0.5 ${
                background.type === "preset" && background.styleId === s.id
                  ? "border-amber-500 ring-2 ring-amber-200"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div
                className="relative flex h-24 items-end p-3"
                style={{ background: s.bg }}
              >
                <span
                  aria-hidden
                  className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-20"
                  style={{ background: s.deco }}
                />
                <span className="text-xs font-bold" style={{ color: s.tx }}>
                  {s.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === "school" && (
        <SchoolBackground defaultSchool={defaultSchool} onChange={setBackground} />
      )}

      {mode === "draw" && (
        <DrawCanvas
          onChange={(dataUrl) => setBackground({ type: "drawn", dataUrl })}
        />
      )}

      {mode === "sticker" && (
        <StickerEditor
          background={background}
          stickers={stickers}
          photo={photo}
          onChange={updateStickers}
          onPhotoChange={updatePhoto}
        />
      )}

      <button
        onClick={onDone}
        aria-label="Continue to QR share"
        className="g-bg glow-btn w-full rounded-xl py-3.5 text-sm font-bold text-white"
      >
        Make my card →
      </button>
    </div>
  );
}
