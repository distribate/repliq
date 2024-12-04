"use server";

import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

type ValidatePostOwner = {
  postId: string;
};

export async function validatePostOwner({ postId }: ValidatePostOwner) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  const { data, error } = await api
    .from("posts_users")
    .select("user_nickname")
    .eq("user_nickname", currentUser.nickname)
    .eq("post_id", postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.user_nickname === currentUser.nickname;
}
