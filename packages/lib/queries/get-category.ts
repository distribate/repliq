import { createClient } from '../utils/supabase/server.ts';

export async function getCategory(category_id: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from("category")
  .select("title, description, id")
  .eq("id", category_id)
  .single()
  
  if (error) {
    console.error(error.message);
    return null
  }
  
  return data;
}