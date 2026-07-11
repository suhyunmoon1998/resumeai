import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The model and token budget are fixed server-side so a signed-in user
// cannot repurpose this proxy as a general-purpose (and expensive) LLM API.
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1200;
const MAX_MESSAGES = 40;
const MAX_CONTENT_CHARS = 20_000;

// Simple per-user rate limit (per server instance).
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 5;
const SWEEP_INTERVAL_MS = 5 * 60_000;
const hits = new Map<string, number[]>();
let lastSweep = Date.now();

/** Drop users whose requests are all outside the window, so the map
 *  can't grow unbounded on a long-lived server instance. */
function sweepStaleEntries(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [id, times] of hits) {
    if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(id);
  }
}

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  sweepStaleEntries(now);
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_REQUESTS) {
    hits.set(userId, recent);
    return true;
  }
  recent.push(now);
  hits.set(userId, recent);
  return false;
}

interface IncomingMessage {
  role: unknown;
  content: unknown;
}

function sanitizeMessages(raw: unknown): { role: string; content: string }[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const out: { role: string; content: string }[] = [];
  for (const m of raw as IncomingMessage[]) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_CONTENT_CHARS
    ) {
      return null;
    }
    out.push({ role: m.role, content: m.content });
  }
  return out;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (isRateLimited(user.id)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const messages = sanitizeMessages(body?.messages);
  if (!messages) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages }),
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("Claude proxy error:", err);
    return NextResponse.json(
      { error: "AI service is temporarily unavailable" },
      { status: 502 }
    );
  }
}
