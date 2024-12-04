import { createClient } from "#utils/api/supabase-client.ts";

export async function getCategory(category_id: string) {
  const api = createClient();

  const { data, error } = await api
    .from("category")
    .select("title, description, id")
    .eq("id", category_id)
    .single();

  if (error) return null;

  return data;
}
