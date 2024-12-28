"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";
import { getCurrentSession } from "#actions/get-current-session.ts";

export type ValidateOwner = {
  type: "posts_comments" | "threads_comments";
  id: number;
};

export async function validateOwner({ id, type }: ValidateOwner) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  const { data: commentCreator, error } = await api
    .from(type)
    .select("user_nickname")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return commentCreator.user_nickname === currentUser.nickname;
}
