"use server";

import { createClient } from "../../../../lib/utils/api/supabase-client.ts";
import {
  ThreadEntity,
  UserEntity,
} from "@repo/types/entities/entities-type.ts";

export async function getThreadCreator(
  threadId: Pick<ThreadEntity, "id">["id"],
): Promise<Pick<UserEntity, "nickname" | "name_color"> | null> {
  const api = createClient();

  const { data, error } = await api
    .from("threads_users")
    .select("users!inner(nickname, name_color)")
    .eq("thread_id", threadId)
    .single();

  if (error) return null;

  const user = Array.isArray(data.users) ? data.users[0] : data.users;

  return user;
}
