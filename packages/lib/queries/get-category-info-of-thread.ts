import { createClient } from "@repo/lib/utils/api/server.ts";
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

type CategoryOfThread = {
  category: {
    id: string,
    title: string
  }
}

export async function getCategoryOfThreadTitle(
  thread_id: Pick<ThreadEntity, 'id'>["id"]
) {
  const api = createClient();
  
  const { data, error } = await api
  .from("category_threads")
  .select("category_id, category(id, title)")
  .eq("thread_id", thread_id)
  .returns<CategoryOfThread[]>()
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0].category;
}