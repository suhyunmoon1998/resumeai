"use client";

import { useEffect, useRef, useState } from "react";
import { BackgroundPattern, BackgroundStyle, CardBackground, School } from "@/types";
import { drawSchoolBackground } from "@/lib/buildCardImage";
import { searchSchools } from "@/lib/schools";
import { Input } from "@/components/ui/input";

const STYLES: { id: BackgroundStyle; name: string; desc: string }[] = [
  { id: "minimal", name: "Minimal", desc: "Solid color + gradient" },
  { id: "watermark", name: "Watermark", desc: "School name repeated" },
  { id: "pattern", name: "Pattern", desc: "Secondary color texture" },
];

const PATTERNS: BackgroundPattern[] = ["dots", "lines", "diagonal", "crosshatch", "grid"];

export default function SchoolBackground({
  defaultSchool,
  onChange,
}: {
  defaultSchool: School | null;
  onChange: (bg: CardBackground) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [school, setSchool] = useState<School | null>(defaultSchool);
  const [style, setStyle] = useState<BackgroundStyle>("watermark");
  const [pattern, setPattern] = useState<BackgroundPattern>("dots");
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const res = await searchSchools(query);
      if (!cancelled) setResults(res);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !school) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSchoolBackground(
      ctx,
      canvas.width,
      canvas.height,
      school.colors?.primary ?? "#333",
      school.colors?.secondary ?? "#666",
      style,
      school.short_name || school.name,
      pattern
    );
    onChange({
      type: "school",
      schoolId: school.id,
      colors: {
        primary: school.colors?.primary ?? "#333",
        secondary: school.colors?.secondary ?? "#666",
      },
      watermark: school.short_name || school.name,
      bgStyle: style,
      pattern: style === "pattern" ? pattern : undefined,
    });
  }, [school, style, pattern, onChange]);

  return (
    <div className="space-y-4">
      {!school && (
        <>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search school or company…"
            aria-label="Search schools for card background"
          />
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {results.map((s) => (
              <button
                key={s.id}
                onClick={() => setSchool(s)}
                aria-label={`Use ${s.name} colors`}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-2 text-left text-sm transition hover:bg-gray-50"
              >
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ background: s.colors?.primary }}
                />
                {s.name}
              </button>
            ))}
          </div>
        </>
      )}

      {school && (
        <>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <span
                aria-hidden
                className="h-3.5 w-3.5 rounded-full"
                style={{ background: school.colors?.primary }}
              />
              {school.name}
            </span>
            <button
              onClick={() => setSchool(null)}
              aria-label="Change school"
              className="text-xs font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Change
            </button>
          </div>

          <canvas
            ref={previewRef}
            width={420}
            height={240}
            className="w-full rounded-2xl"
            aria-label="Card background preview"
          />

          <div className="grid grid-cols-3 gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                aria-label={`Background style ${s.name}`}
                className={`rounded-xl border-2 p-3 text-left transition ${
                  style === s.id ? "border-gray-900" : "border-gray-200"
                }`}
              >
                <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">{s.name}</span>
                <span className="block text-[11px] text-gray-400">{s.desc}</span>
              </button>
            ))}
          </div>

          {style === "pattern" && (
            <div className="flex flex-wrap gap-2">
              {PATTERNS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  aria-label={`Pattern ${p}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    pattern === p
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
