"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
  return (
    <button
      onClick={signOut}
      aria-label="Sign out"
      className="text-sm font-medium text-gray-400 transition hover:text-gray-700"
    >
      Sign out
    </button>
  );
}
