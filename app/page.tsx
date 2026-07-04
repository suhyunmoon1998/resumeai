import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const FEATURES = [
  {
    icon: "🎙",
    title: "Voice-first interview",
    desc: "No blank page. Answer 9–12 spoken questions and your resume assembles itself in real time.",
    span: "md:col-span-2",
  },
  {
    icon: "✦",
    title: "AI template pick",
    desc: "Claude reads your career story and recommends the template recruiters in your field expect.",
    span: "",
  },
  {
    icon: "📄",
    title: "10 ATS-safe templates",
    desc: "Single-column, skills-first, and sidebar layouts — all export to pixel-perfect DOCX.",
    span: "",
  },
  {
    icon: "🎓",
    title: "School-color cards",
    desc: "Business cards in your school or company's official colors — watermark, pattern, or minimal.",
    span: "md:col-span-2",
  },
  {
    icon: "📇",
    title: "QR everything",
    desc: "One scan shares your card, contact (.vcf), and live profile page.",
    span: "",
  },
  {
    icon: "✏️",
    title: "Draw mode",
    desc: "Feeling personal? Sketch your own card background on a sticky note canvas.",
    span: "",
  },
  {
    icon: "⚡️",
    title: "Done in 5 minutes",
    desc: "Talk, pick a style, download. Resume + business card + share link — before your coffee cools.",
    span: "",
  },
];

const STEPS = [
  { n: "01", title: "Talk", desc: "Our cloud interviewer asks — you just answer out loud." },
  { n: "02", title: "Pick", desc: "AI recommends a template. Swap freely among all 10." },
  { n: "03", title: "Share", desc: "Download DOCX, mint your QR card, send it anywhere." },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="mesh-bg relative min-h-screen overflow-hidden text-gray-900">
      {/* Floating gradient blobs */}
      <div aria-hidden className="blob left-[-8rem] top-[-6rem] h-96 w-96 bg-indigo-400" />
      <div aria-hidden className="blob blob-2 right-[-6rem] top-40 h-80 w-80 bg-fuchsia-400" />
      <div aria-hidden className="blob blob-3 bottom-[-8rem] left-1/3 h-96 w-96 bg-sky-300" />

      {/* Nav */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav className="glass mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-5 py-3 shadow-sm">
          <span className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span aria-hidden>☁️</span> VoiceResume
          </span>
          <div className="flex items-center gap-5">
            <a href="#features" className="hidden text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:block">
              Features
            </a>
            <a href="#pricing" className="hidden text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:block">
              Pricing
            </a>
            <Link
              href="/auth/login"
              className="g-bg glow-btn rounded-xl px-4 py-2 text-sm font-bold text-white"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-20 text-center md:pt-28">
        <span className="g-border mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700">
          <span className="g-bg inline-block h-1.5 w-1.5 rounded-full" aria-hidden />
          Powered by Claude · Voice AI resume builder
        </span>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Just talk.
          <br />
          <span className="shimmer-text">Watch it write itself.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-500 md:text-xl">
          A 5-minute voice interview becomes a polished, ATS-ready resume and a
          QR business card in your school&apos;s colors.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <GoogleSignInButton />
          <a
            href="#how"
            className="text-sm font-semibold text-gray-500 underline-offset-4 transition hover:text-gray-900 hover:underline"
          >
            See how it works ↓
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
          <span>✓ Free to start</span>
          <span>✓ No credit card</span>
          <span>✓ DOCX + vCard export</span>
        </div>

        {/* Hero mock */}
        <div className="card-hover glass mt-16 w-full max-w-3xl rounded-3xl p-4 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 p-6">
              <span className="text-5xl" aria-hidden>☁️</span>
              <p className="font-caveat text-2xl text-gray-700">&ldquo;Tell me about yourself.&rdquo;</p>
              <span className="g-bg inline-flex h-12 w-12 items-center justify-center rounded-full text-xl text-white shadow-lg" aria-hidden>
                🎙
              </span>
            </div>
            <div className="flex-1 rounded-2xl bg-white/80 p-6 text-left">
              <div className="g-bg mb-3 h-8 w-2/3 rounded-lg opacity-90" />
              <div className="mb-4 h-3 w-1/2 rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded bg-gray-100" />
                <div className="h-2.5 w-11/12 rounded bg-gray-100" />
                <div className="h-2.5 w-4/5 rounded bg-gray-100" />
              </div>
              <div className="mt-4 flex gap-1.5">
                {["React", "Figma", "SQL"].map((s) => (
                  <span key={s} className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section id="features" className="relative mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
          Everything between <span className="g-text">hello</span> and <span className="g-text">hired</span>
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`card-hover glass rounded-3xl p-6 ${f.span}`}
            >
              <span className="text-3xl" aria-hidden>{f.icon}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
          Three steps. Zero typing.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card-hover glass rounded-3xl p-8 text-center">
              <span className="g-text font-display text-5xl font-bold">{s.n}</span>
              <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
          Simple pricing
        </h2>
        <p className="mt-3 text-center text-gray-500">Start free. Upgrade when you&apos;re ready to stand out.</p>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card-hover glass rounded-3xl p-8">
            <h3 className="font-display text-lg font-bold">Free</h3>
            <p className="mt-2 font-display text-4xl font-bold">
              $0<span className="text-base font-medium text-gray-400"> / forever</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-gray-600">
              <li>✓ 1 voice interview resume</li>
              <li>✓ 3 ATS-safe templates</li>
              <li>✓ QR business card + share link</li>
              <li>✓ DOCX &amp; vCard export</li>
            </ul>
            <Link
              href="/auth/login"
              className="mt-8 block rounded-xl border-2 border-gray-900 py-3 text-center text-sm font-bold text-gray-900 transition hover:bg-gray-900 hover:text-white"
            >
              Start free
            </Link>
          </div>
          <div className="card-hover relative overflow-hidden rounded-3xl bg-gray-950 p-8 text-white shadow-2xl">
            <div aria-hidden className="blob right-[-4rem] top-[-4rem] h-48 w-48 bg-violet-500 opacity-40" />
            <span className="g-bg absolute right-6 top-6 rounded-full px-3 py-1 text-[11px] font-bold">
              Most popular
            </span>
            <h3 className="font-display text-lg font-bold">Pro</h3>
            <p className="mt-2 font-display text-4xl font-bold">
              $9<span className="text-base font-medium text-gray-400"> / month</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-gray-300">
              <li>✓ Unlimited resumes &amp; cards</li>
              <li>✓ All 10 templates + AI recommendation</li>
              <li>✓ School-color &amp; hand-drawn card backgrounds</li>
              <li>✓ Card view analytics</li>
              <li>✓ Priority AI generation</li>
            </ul>
            <Link
              href="/auth/login"
              className="g-bg glow-btn mt-8 block rounded-xl py-3 text-center text-sm font-bold text-white"
            >
              Go Pro
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-4xl px-6 pb-24 pt-8">
        <div className="card-hover relative overflow-hidden rounded-3xl bg-gray-950 px-8 py-14 text-center text-white">
          <div aria-hidden className="blob left-[-3rem] top-[-3rem] h-56 w-56 bg-indigo-500 opacity-40" />
          <div aria-hidden className="blob blob-2 bottom-[-4rem] right-[-3rem] h-56 w-56 bg-fuchsia-500 opacity-40" />
          <h2 className="relative font-display text-3xl font-bold tracking-tight md:text-4xl">
            Your next role is one conversation away.
          </h2>
          <p className="relative mt-3 text-gray-400">Free to try — takes about 5 minutes.</p>
          <div className="relative mt-8 flex justify-center">
            <GoogleSignInButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200/60 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-400 sm:flex-row">
          <span className="font-display font-bold text-gray-600">☁️ VoiceResume</span>
          <span>Just talk. Watch it write itself.</span>
          <span>© {new Date().getFullYear()} VoiceResume</span>
        </div>
      </footer>
    </main>
  );
}
