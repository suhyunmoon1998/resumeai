"use client";

import { useEffect, useState } from "react";
import { ResumeData } from "@/types";
import { getTemplate } from "@/lib/templates";

/** Typewriter text — types in whenever `text` changes. */
function TypeIn({ text, ms = 16, className }: { text: string; ms?: number; className?: string }) {
  const [shown, setShown] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setShown("");
      return;
    }
    let i = 0;
    let cancelled = false;
    setShown("");
    setTyping(true);
    const next = () => {
      if (cancelled) return;
      if (i < text.length) {
        setShown(text.slice(0, ++i));
        setTimeout(next, ms);
      } else {
        setTyping(false);
      }
    };
    next();
    return () => {
      cancelled = true;
    };
  }, [text, ms]);

  return <span className={`${className ?? ""} ${typing ? "type-caret" : ""}`}>{shown}</span>;
}

export default function ResumePanel({
  data,
  answers,
  templateId,
  generating,
}: {
  data: ResumeData | null;
  answers: Record<string, string>;
  templateId: string;
  generating?: boolean;
}) {
  const template = getTemplate(templateId);
  const accent = template.accent;

  const draftName = answers.name || "";
  const draftTitle = answers.title || "";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 text-white" style={{ background: accent }}>
        <h2 className="text-2xl font-extrabold leading-tight">
          {data ? data.name : <TypeIn text={draftName || "Your Name"} />}
        </h2>
        <p className="text-sm opacity-90">
          {data ? data.title : <TypeIn text={draftTitle || "Your title"} />}
        </p>
        {data && (
          <p className="mt-1 text-xs opacity-75">
            {[data.contact?.email, data.contact?.phone, data.contact?.location]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        )}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm">
        {generating && (
          <div className="flex items-center gap-2 text-gray-400">
            <span className="thinking-dot h-2 w-2 rounded-full bg-gray-300" />
            <span className="thinking-dot h-2 w-2 rounded-full bg-gray-300" />
            <span className="thinking-dot h-2 w-2 rounded-full bg-gray-300" />
            <span className="ml-1">Writing your resume…</span>
          </div>
        )}

        {data ? (
          <>
            {data.summary && (
              <Section title="Summary" accent={accent}>
                <TypeIn text={data.summary} ms={8} className="text-gray-600" />
              </Section>
            )}
            {template.layout === "skills" && data.skills?.length > 0 && (
              <SkillsBlock skills={data.skills} accent={accent} />
            )}
            {data.experience?.length > 0 && (
              <Section title="Experience" accent={accent}>
                <div className="space-y-3">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <p className="font-bold text-gray-800">
                        {exp.role}
                        <span className="font-normal text-gray-500"> — {exp.company}</span>
                      </p>
                      <p className="text-xs italic text-gray-400">{exp.period}</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-gray-600">
                        {exp.bullets?.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}
            {data.education?.length > 0 && (
              <Section title="Education" accent={accent}>
                {data.education.map((e, i) => (
                  <p key={i} className="text-gray-600">
                    <span className="font-semibold text-gray-800">{e.school}</span>
                    {e.degree ? ` — ${e.degree}` : ""}
                    {e.year ? ` (${e.year})` : ""}
                  </p>
                ))}
              </Section>
            )}
            {template.layout !== "skills" && data.skills?.length > 0 && (
              <SkillsBlock skills={data.skills} accent={accent} />
            )}
            {data.languages?.length > 0 && (
              <Section title="Languages" accent={accent}>
                <p className="text-gray-600">{data.languages.join("  ·  ")}</p>
              </Section>
            )}
            {data.metric && (
              <Section title="Key Achievement" accent={accent}>
                <p className="italic text-gray-600">{data.metric}</p>
              </Section>
            )}
          </>
        ) : (
          <DraftView answers={answers} accent={accent} />
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3
        className="mb-1.5 border-b pb-1 text-xs font-extrabold uppercase tracking-wider"
        style={{ color: accent, borderColor: accent }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function SkillsBlock({ skills, accent }: { skills: string[]; accent: string }) {
  return (
    <Section title="Skills" accent={accent}>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s, i) => (
          <span
            key={i}
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
            style={{ background: accent }}
          >
            {s}
          </span>
        ))}
      </div>
    </Section>
  );
}

const DRAFT_LABELS: Record<string, string> = {
  summary: "Summary",
  exp1: "Recent experience",
  exp2: "Previous experience",
  edu: "Education",
  skills: "Skills",
  langs: "Languages",
  links: "Links",
  metric: "Key achievement",
};

function DraftView({ answers, accent }: { answers: Record<string, string>; accent: string }) {
  const entries = Object.entries(DRAFT_LABELS).filter(([k]) => answers[k]);
  if (entries.length === 0) {
    return (
      <p className="text-gray-300">
        Your resume builds itself here as you answer. ✨
      </p>
    );
  }
  return (
    <>
      {entries.map(([key, label]) => (
        <Section key={key} title={label} accent={accent}>
          <TypeIn text={answers[key]} ms={8} className="text-gray-600" />
        </Section>
      ))}
    </>
  );
}
