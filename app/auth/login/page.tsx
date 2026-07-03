import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white px-6">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="text-6xl" aria-hidden>
          ☁️
        </div>
        <div>
          <h1 className="font-caveat-brush text-5xl text-gray-900">VoiceResume</h1>
          <p className="mt-3 text-gray-500">
            Sign in to start your voice interview.
          </p>
        </div>
        <GoogleSignInButton />
      </div>
    </main>
  );
}
