"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";

type ValidatePostOwner = {
  postId: string;
};

export async function validatePostOwner({ postId }: ValidatePostOwner) {
  const api = createClient();

  const { data, error } = await api
    .from("posts_users")
    .select("user_nickname")
    .eq("user_nickname", "123")
    .eq("post_id", postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.user_nickname === "123";
}
