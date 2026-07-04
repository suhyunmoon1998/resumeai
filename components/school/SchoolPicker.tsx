"use client";

import { useEffect, useState } from "react";
import { School } from "@/types";
import { searchSchools, setProfileSchool } from "@/lib/schools";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function SchoolPicker({
  onSelected,
}: {
  onSelected?: (school: School) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [selected, setSelected] = useState<School | null>(null);
  const [isGraduated, setIsGraduated] = useState(false);
  const [gradYear, setGradYear] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await setProfileSchool(
        selected.id,
        isGraduated,
        gradYear ? parseInt(gradYear, 10) : undefined
      );
      toast("School saved ✓");
      onSelected?.(selected);
    } catch {
      toast("Failed to save school", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your school or company…"
        aria-label="Search schools and companies"
      />

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {results.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            aria-label={`Select ${s.name}`}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition ${
              selected?.id === s.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span
              aria-hidden
              className="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
              style={{ background: s.colors?.primary ?? "#999" }}
            />
            <span className="flex-1">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">{s.name}</span>
              <span className="block text-xs text-gray-400">
                {s.type === "company" ? "Company" : "University"}
                {s.domain ? ` · ${s.domain}` : ""}
              </span>
            </span>
          </button>
        ))}
        {results.length === 0 && (
          <p className="px-1 py-4 text-sm text-gray-400">No matches found.</p>
        )}
      </div>

      {selected && (
        <div className="space-y-3 rounded-xl border border-gray-200 p-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={isGraduated}
              onChange={(e) => setIsGraduated(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            I&apos;ve graduated / alumni
          </label>
          {isGraduated && (
            <Input
              type="number"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              placeholder="Graduation year (e.g. 2024)"
              aria-label="Graduation year"
            />
          )}
          <Button onClick={save} disabled={saving} className="w-full" aria-label="Save school">
            {saving ? "Saving…" : `Save ${selected.short_name || selected.name}`}
          </Button>
        </div>
      )}
    </div>
  );
}
