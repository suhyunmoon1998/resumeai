"use client";

import { useState } from "react";
import { CARD_STYLES } from "@/lib/templates";
import { CardBackground, School } from "@/types";
import SchoolBackground from "@/components/card/SchoolBackground";
import DrawCanvas from "@/components/card/DrawCanvas";

type Mode = "preset" | "school" | "draw";

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

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6 py-10">
      <div className="text-center">
        <h1 className="font-caveat-brush text-4xl text-gray-900">Design your card</h1>
        <p className="mt-1 text-gray-500">
          Pick a preset, use your school colors, or draw your own.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {(
          [
            ["preset", "🎨 Presets"],
            ["school", "🎓 School colors"],
            ["draw", "✏️ Draw"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-label={`Card background mode: ${label}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === m
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "preset" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CARD_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() =>
                onChange({ type: "preset", styleId: s.id, color: s.bg })
              }
              aria-label={`Card style ${s.name}`}
              className={`overflow-hidden rounded-2xl border-2 transition hover:-translate-y-0.5 ${
                background.type === "preset" && background.styleId === s.id
                  ? "border-gray-900"
                  : "border-gray-200"
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
        <SchoolBackground defaultSchool={defaultSchool} onChange={onChange} />
      )}

      {mode === "draw" && (
        <DrawCanvas
          onChange={(dataUrl) => onChange({ type: "drawn", dataUrl })}
        />
      )}

      <button
        onClick={onDone}
        aria-label="Continue to QR share"
        className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-gray-700"
      >
        Make my card →
      </button>
    </div>
  );
}
