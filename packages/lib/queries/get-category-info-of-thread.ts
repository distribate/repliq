import { createClient } from '../utils/supabase/server.ts';
import { ThreadRequest } from '@repo/components/src/thread/types/thread-request-types.ts';

type CategoryOfThread = {
  category: {
    id: string,
    title: string
  }
}

export async function getCategoryOfThreadTitle({
  thread_id
}: ThreadRequest) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from("category_threads")
  .select("category_id, category(id, title)")
  .eq("thread_id", thread_id)
  .returns<CategoryOfThread[]>()
  
  if (error) throw new Error(error.message);
  
  return data[0].category;
}