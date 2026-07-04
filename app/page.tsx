import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import ScrollReveal from "@/components/fx/ScrollReveal";
import ThemeToggle from "@/components/theme/ThemeToggle";

const FEATURES = [
  { icon: "🎙", title: "Just speak", desc: "9–12 friendly questions. Your resume writes itself while you talk." },
  { icon: "✦", title: "AI picks your style", desc: "Claude reads your story and recommends the right template." },
  { icon: "📄", title: "10 templates", desc: "ATS-safe layouts that export to a polished DOCX." },
  { icon: "🎓", title: "Your school's colors", desc: "Business cards in your school or company's official palette." },
  { icon: "📇", title: "QR name card", desc: "One scan shares your contact, card, and live profile page." },
  { icon: "✏️", title: "Doodle it", desc: "Draw your own card background on a sticky note." },
];

const STEPS = [
  { n: "1", title: "Talk", desc: "The little cloud asks. You answer out loud." },
  { n: "2", title: "Pick", desc: "Choose a template — or trust the AI pick." },
  { n: "3", title: "Share", desc: "Download, make your QR card, send it anywhere." },
];

function Squiggle() {
  return (
    <svg
      viewBox="0 0 300 20"
      className="mx-auto mt-2 h-4 w-56 text-violet-400"
      aria-hidden
    >
      <path
        d="M5 12 Q 40 2, 75 10 T 150 10 T 220 12 T 295 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="mesh-bg relative min-h-screen overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav className="glass mx-auto flex max-w-4xl items-center justify-between rounded-2xl px-5 py-3 shadow-sm">
          <span className="font-caveat-brush text-2xl">☁️ VoiceResume</span>
          <div className="flex items-center gap-4">
            <a
              href="#how"
              className="hidden font-caveat text-xl text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 sm:block"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="hidden font-caveat text-xl text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 sm:block"
            >
              Pricing
            </a>
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="g-bg glow-btn rounded-xl px-4 py-2 font-caveat text-lg font-bold text-white"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero — handwritten, no mock imagery */}
      <section className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-24 text-center md:pt-32">
        <div className="animate-float text-7xl" aria-hidden>
          ☁️
        </div>

        <h1 className="mt-8 font-caveat-brush text-6xl leading-[1.05] md:text-8xl">
          Just talk.
          <br />
          <span className="g-text">Watch it write itself.</span>
        </h1>
        <Squiggle />

        <p className="mt-8 max-w-lg font-caveat text-2xl leading-snug text-gray-600 dark:text-gray-300 md:text-3xl">
          A five-minute chat becomes your resume and a QR name card — for
          school or for work.
        </p>

        <div className="mt-10">
          <GoogleSignInButton />
        </div>

        <p className="mt-6 font-caveat text-lg text-gray-400">
          free to start · no credit card · done before your coffee cools
        </p>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-4xl px-6 py-16">
        <ScrollReveal>
          <h2 className="text-center font-caveat-brush text-5xl">
            What the little cloud does
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 70}>
              <div className="card-hover glass h-full rounded-3xl p-6 text-center">
                <span className="text-4xl" aria-hidden>
                  {f.icon}
                </span>
                <h3 className="mt-3 font-caveat text-3xl font-bold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {f.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-4xl px-6 py-16">
        <ScrollReveal>
          <h2 className="text-center font-caveat-brush text-5xl">
            Three steps. Zero typing.
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 120}>
              <div className="card-hover glass h-full rounded-3xl p-8 text-center">
                <span className="g-text font-caveat-brush text-6xl">{s.n}</span>
                <h3 className="mt-3 font-caveat text-3xl font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mx-auto max-w-3xl px-6 py-16">
        <ScrollReveal>
          <h2 className="text-center font-caveat-brush text-5xl">Simple pricing</h2>
          <p className="mt-2 text-center font-caveat text-2xl text-gray-500 dark:text-gray-400">
            Start free. Upgrade when you&apos;re ready to stand out.
          </p>
        </ScrollReveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card-hover glass rounded-3xl p-8">
            <h3 className="font-caveat text-3xl font-bold">Free</h3>
            <p className="mt-1 font-caveat-brush text-5xl">
              $0<span className="font-caveat text-xl text-gray-400"> / forever</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>✓ 1 voice interview resume</li>
              <li>✓ 3 templates</li>
              <li>✓ QR name card + share link</li>
              <li>✓ DOCX &amp; vCard export</li>
            </ul>
            <Link
              href="/auth/login"
              className="mt-7 block rounded-xl border-2 border-gray-900 py-3 text-center font-caveat text-xl font-bold text-gray-900 transition hover:bg-gray-900 hover:text-white dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900"
            >
              Start free
            </Link>
          </div>
          <div className="card-hover relative overflow-hidden rounded-3xl bg-gray-950 p-8 text-white shadow-2xl">
            <span className="g-bg absolute right-6 top-6 rounded-full px-3 py-1 font-caveat text-base font-bold">
              Most popular
            </span>
            <h3 className="font-caveat text-3xl font-bold">Pro</h3>
            <p className="mt-1 font-caveat-brush text-5xl">
              $9<span className="font-caveat text-xl text-gray-400"> / month</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>✓ Unlimited resumes &amp; cards</li>
              <li>✓ All 10 templates + AI pick</li>
              <li>✓ School-color &amp; hand-drawn backgrounds</li>
              <li>✓ Card view analytics</li>
            </ul>
            <Link
              href="/auth/login"
              className="g-bg glow-btn mt-7 block rounded-xl py-3 text-center font-caveat text-xl font-bold text-white"
            >
              Go Pro
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-3xl px-6 pb-24 pt-8 text-center">
        <ScrollReveal>
          <h2 className="font-caveat-brush text-5xl md:text-6xl">
            Your next chapter is
            <br />
            <span className="g-text">one conversation away.</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <GoogleSignInButton />
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200/60 px-6 py-8 dark:border-gray-800">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 font-caveat text-xl text-gray-400 sm:flex-row">
          <span className="font-caveat-brush text-gray-600 dark:text-gray-300">☁️ VoiceResume</span>
          <span>Just talk. Watch it write itself.</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
