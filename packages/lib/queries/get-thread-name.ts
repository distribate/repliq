import { createClient } from "@repo/shared/api/supabase-client.ts";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";

export async function getTopicName(thread_id: Pick<ThreadEntity, "id">["id"]) {
  const api = createClient();

  const { data, error } = await api
    .from("threads")
    .select("title")
    .eq("id", thread_id)
    .single();

  if (error) return null;

  return data;
}
