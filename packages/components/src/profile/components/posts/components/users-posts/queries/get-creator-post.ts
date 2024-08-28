import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function getCreatorPost(
  nickname: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
  .from("users")
  .select("name_color, nickname")
  .eq("nickname", nickname)
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}