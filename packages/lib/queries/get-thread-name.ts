import { createClient } from '../utils/supabase/server.ts';
import { ThreadRequest } from '@repo/components/src/thread/types/thread-request-types.ts';

export async function getTopicName({
  thread_id
}: ThreadRequest) {
  const supabase = createClient();
  
  if (!thread_id) return null;
  
  const { data, error } = await supabase
  .from("threads")
  .select("title")
  .eq("id", thread_id)
  .single()
  
  if (error) throw new Error(error.message);
  
  return data;
}