import { createClient } from "#utils/api/supabase-client.ts";
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

type CategoryOfThread = {
  id: string, title: string
}

export async function getCategoryOfThreadTitle(
  thread_id: Pick<ThreadEntity, 'id'>["id"]
): Promise<CategoryOfThread | null> {
  const api = createClient();
  
  const { data, error } = await api
  .from("category_threads")
  .select("category_id, category(id, title)")
  .eq("thread_id", thread_id)
  .single()
  
  if (error) {
    throw new Error(error.message);
  }
  
  // @ts-ignore
  return data.category;
}