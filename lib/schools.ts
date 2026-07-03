import { createClient } from "@/lib/supabase/client";
import { School } from "@/types";

export async function searchSchools(query: string): Promise<School[]> {
  const supabase = createClient();
  let req = supabase.from("schools").select("*").order("name").limit(12);
  if (query.trim()) {
    req = req.or(`name.ilike.%${query}%,short_name.ilike.%${query}%`);
  }
  const { data, error } = await req;
  if (error) return [];
  return (data as School[]) ?? [];
}

export async function getSchool(id: string): Promise<School | null> {
  const supabase = createClient();
  const { data } = await supabase.from("schools").select("*").eq("id", id).single();
  return (data as School) ?? null;
}

export async function setProfileSchool(
  schoolId: string,
  isGraduated: boolean,
  graduationYear?: number
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { error } = await supabase
    .from("profiles")
    .update({
      school_id: schoolId,
      is_graduated: isGraduated,
      graduation_year: graduationYear ?? null,
    })
    .eq("id", user.id);
  if (error) throw error;
}
