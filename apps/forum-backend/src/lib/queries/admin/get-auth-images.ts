import { supabase } from "#shared/supabase/supabase-client.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";

export const getAuthImages = async () => {
  const { data } = await supabase.storage.from(STATIC_IMAGES_BUCKET).list("auth_background");

  return data;
}