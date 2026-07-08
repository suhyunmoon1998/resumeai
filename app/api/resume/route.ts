import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: `${body.resumeData?.name || "Resume"} — ${new Date().toLocaleDateString()}`,
      role_type: body.roleType,
      template_id: body.templateId,
      data: body.resumeData,
      raw_answers: body.rawAnswers,
    })
    .select()
    .single();
  if (error) { console.error(error); return NextResponse.json({ error: "Request failed" }, { status: 500 }); }
  return NextResponse.json({ resume: data });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) { console.error(error); return NextResponse.json({ error: "Request failed" }, { status: 500 }); }
  return NextResponse.json({ resumes: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) { console.error(error); return NextResponse.json({ error: "Request failed" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
