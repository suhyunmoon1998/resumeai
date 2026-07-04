import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Upload card image to storage when a data URL is provided
  let cardImageUrl: string | undefined;
  if (body.imageDataUrl) {
    try {
      const base64 = (body.imageDataUrl as string).split(",")[1];
      const bytes = Buffer.from(base64, "base64");
      const path = `${user.id}/${Date.now()}.png`;
      const { error: upErr } = await supabase.storage
        .from("card-images")
        .upload(path, bytes, { contentType: "image/png" });
      if (!upErr) {
        const { data: pub } = supabase.storage.from("card-images").getPublicUrl(path);
        cardImageUrl = pub.publicUrl;
      }
    } catch {
      // Storage upload is best-effort; the card row is still saved.
    }
  }

  const { data, error } = await supabase
    .from("cards")
    .insert({
      user_id: user.id,
      resume_id: body.resumeId ?? null,
      style_id: body.styleId ?? "c1",
      background_type: body.backgroundType ?? "preset",
      background_data: body.backgroundData ?? null,
      card_image_url: cardImageUrl ?? null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ card: data });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ cards: data });
}
