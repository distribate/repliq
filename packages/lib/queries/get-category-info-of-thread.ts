import { createClient } from "@repo/lib/utils/api/server.ts";
import { ThreadRequest } from '@repo/components/src/thread/types/thread-request-types.ts';

type CategoryOfThread = {
  category: {
    id: string,
    title: string
  }
}

export async function getCategoryOfThreadTitle(
  thread_id: ThreadRequest["thread_id"]
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