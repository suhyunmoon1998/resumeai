import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ResumeData, SavedCard } from "@/types";
import PublicCardView from "@/components/card/PublicCardView";

export const dynamic = "force-dynamic";

export default async function PublicCardPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServiceClient();

  const { data: card } = await supabase
    .from("cards")
    .select("*, resume:resumes(data)")
    .eq("share_slug", params.slug)
    .single();

  if (!card) notFound();

  // Best-effort view counter
  await supabase.rpc("increment_card_views", { slug: params.slug });

  const typedCard = card as SavedCard & { resume: { data: ResumeData } | null };
  const resumeData = typedCard.resume?.data ?? null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 py-12">
      <PublicCardView card={typedCard} resumeData={resumeData} />
      <p className="mt-8 text-xs text-gray-600">
        Made with <span className="font-caveat-brush text-gray-400">☁️ VoiceResume</span>
        {" · "}
        {typedCard.view_count + 1} views
      </p>
    </main>
  );
}
