import { supabase } from "#shared/supabase/supabase-client.ts";

export const getAuthImages = async () => {
  const { data } = await supabase.storage.from("static").list("auth_background");

  return data;
}