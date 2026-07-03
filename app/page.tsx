import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white px-6">
      <div className="flex max-w-2xl flex-col items-center gap-10 text-center">
        <div className="text-7xl" aria-hidden>
          ☁️
        </div>
        <div>
          <p className="font-caveat text-2xl text-sky-600">VoiceResume</p>
          <h1 className="mt-2 font-caveat-brush text-6xl leading-tight text-gray-900 md:text-7xl">
            Just talk.
            <br />
            Watch it write itself.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-gray-500">
            Answer a few voice interview questions and get a polished resume
            plus a QR business card — in minutes.
          </p>
        </div>
        <GoogleSignInButton />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
          <span>🎙 Voice interview</span>
          <span>📄 10 resume templates</span>
          <span>📇 QR business card</span>
        </div>
      </div>
    </main>
  );
}
