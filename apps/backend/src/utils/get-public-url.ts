import { getSupabaseClient } from "#shared/supabase/index.ts";

export const getPublicUrl = (bucket: string, url: string) => {
  const supabase = getSupabaseClient();

  return supabase.storage.from(bucket).getPublicUrl(url).data.publicUrl
}