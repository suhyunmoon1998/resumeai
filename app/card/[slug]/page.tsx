import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ResumeData, SavedCard } from "@/types";
import PublicCardView from "@/components/card/PublicCardView";
import DeliveryReveal from "@/components/card/DeliveryReveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: card } = await supabase
    .from("cards")
    .select("card_image_url, resume:resumes(data)")
    .eq("share_slug", slug)
    .single();
  if (!card) return { title: "Card not found — VoiceResume" };

  // Supabase types to-one joins as arrays; at runtime this is a single object.
  const typed = card as unknown as {
    card_image_url: string | null;
    resume: { data: ResumeData } | null;
  };
  const name = typed.resume?.data?.name || "A VoiceResume user";
  const title = `${name} — digital business card`;
  const description = `Scan or tap to save ${name}'s contact info.`;
  const images = typed.card_image_url ? [typed.card_image_url] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: {
      card: typed.card_image_url ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export default async function PublicCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: card } = await supabase
    .from("cards")
    .select("*, resume:resumes(data)")
    .eq("share_slug", slug)
    .single();

  if (!card) notFound();

  // Best-effort view counter
  await supabase.rpc("increment_card_views", { slug });

  const typedCard = card as SavedCard & { resume: { data: ResumeData } | null };
  const resumeData = typedCard.resume?.data ?? null;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-gray-950 px-6 py-12">
      <DeliveryReveal />
      <PublicCardView card={typedCard} resumeData={resumeData} />
      <p className="mt-8 text-xs text-gray-600">
        Made with <span className="font-caveat-brush text-gray-400">☁️ VoiceResume</span>
        {" · "}
        {typedCard.view_count + 1} views
      </p>
    </main>
  );
}
