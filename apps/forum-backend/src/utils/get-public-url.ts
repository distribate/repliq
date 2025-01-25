import { supabase } from "#shared/supabase/supabase-client.ts";

export async function getPublicUrl(bucket: string, url: string) {
  return supabase.storage.from(bucket).getPublicUrl(url);
}