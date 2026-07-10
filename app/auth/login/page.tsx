import Link from "next/link";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  return (
    <main className="mesh-bg relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <div aria-hidden className="blob left-[-6rem] top-[-4rem] h-80 w-80 bg-yellow-300" />
      <div aria-hidden className="blob blob-2 bottom-[-6rem] right-[-4rem] h-80 w-80 bg-amber-300" />

      <div className="glass card-hover tape note-rot-l relative flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl px-8 py-12 text-center shadow-xl">
        <div className="text-6xl" aria-hidden>
          ☁️
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Welcome to <span className="g-text">VoiceResume</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Sign in to start your voice interview.
          </p>
        </div>
        <GoogleSignInButton />
        <Link href="/" className="text-xs font-medium text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-300">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
