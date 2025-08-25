import { supabase } from "#shared/supabase/supabase-client.ts";

export const getPublicUrl = (bucket: string, url: string) =>
  supabase.storage.from(bucket).getPublicUrl(url).data.publicUrl