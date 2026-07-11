import { ResumeData } from "@/types";

const MODEL = "claude-sonnet-4-6";

async function callClaude(prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "Claude API error");
  return (data.content as { text?: string }[])
    .map((i) => i.text || "")
    .join("")
    .replace(/```json|```/g, "")
    .trim();
}

/** The model occasionally returns malformed JSON — surface that as a normal,
 *  catchable error instead of an uncaught SyntaxError. */
function parseJson<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("AI returned an invalid response — please try again");
  }
}

export async function generateResume(
  answers: Record<string, string>,
  questions: { key: string; speak: string }[]
): Promise<ResumeData> {
  const txt = questions
    .map((q) => `Q: ${q.speak}\nA: ${answers[q.key] || "N/A"}`)
    .join("\n\n");
  const prompt =
    `Resume interview. Return ONLY valid JSON, no markdown:\n\n${txt}\n\n` +
    `{"name":"","title":"","contact":{"email":"","phone":"","location":""},"summary":"",` +
    `"experience":[{"company":"","role":"","period":"","bullets":[""]}],` +
    `"education":[{"school":"","degree":"","year":""}],"skills":[],"languages":[],"links":"","metric":""}` +
    `\n\nRules: only use mentioned info, 2-3 bullets per role, English, concise.`;

  const raw = await callClaude(prompt, 1200);
  return parseJson<ResumeData>(raw);
}

export async function getTemplateRecommendation(
  answers: Record<string, string>
): Promise<{ templateId: string; reason: string }> {
  const prompt = `Based on this career info, pick ONE template ID and give a reason (max 12 words).
Title: ${answers.title || ""}
Summary: ${answers.summary || ""}
Experience: ${answers.exp1 || ""}
Skills: ${answers.skills || ""}

Template IDs and use cases:
- ats_clean: corporate, finance, law, banking, government
- ats_teal: tech, healthcare, product management
- ats_slate: consulting, accounting, legal
- skills_first: career changers, developers, analysts
- skills_purple: developers, UX designers, data scientists
- sidebar_navy: creative, UX/UI designers, art directors
- sidebar_mint: marketing, PR, media, journalism
- classic: any traditional industry
- executive: senior managers, VPs, directors, C-suite
- fresh: recent graduates, interns, entry-level

Return ONLY JSON: {"templateId":"","reason":""}`;

  const raw = await callClaude(prompt, 80);
  return parseJson<{ templateId: string; reason: string }>(raw);
}
