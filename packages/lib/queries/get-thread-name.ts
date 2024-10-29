import { createClient } from "@repo/lib/utils/api/server.ts";
import { ThreadRequest } from '@repo/components/src/thread/types/thread-request-types.ts';

export async function getTopicName(thread_id: ThreadRequest["thread_id"]) {
  if (!thread_id) return null;
  
  const api = createClient();
  
  const { data, error } = await api
  .from("threads")
  .select("title")
  .eq("id", thread_id)
  .single()
  
  if (error) return null;
  
  return data;
}