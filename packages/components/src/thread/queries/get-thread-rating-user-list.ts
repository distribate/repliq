import { createClient } from "../../../../lib/utils/api/supabase-client.ts";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts";

type ThreadRatingUserUserList = Pick<ThreadEntity, "id">;

export async function getThreadRatingUserList({
  id,
}: ThreadRatingUserUserList) {
  const api = createClient();

  const { data, error } = await api
    .from("threads_rating")
    .select("users!inner(nickname, id)")
    .eq("thread_id", id);

  if (error) {
    return null;
  }

  return data.flatMap((item) => item.users);
}
