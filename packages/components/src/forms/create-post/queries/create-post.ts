"use server";

import "server-only";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { PostEntity } from "@repo/types/entities/entities-type.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

type CreatePost = Pick<PostEntity, "id"> & {
  user_nickname: string;
};

async function createPostUsers({ id: post_id, user_nickname }: CreatePost) {
  const api = createClient();

  const { error } = await api
    .from("posts_users")
    .insert({ post_id, user_nickname });

  return !error;
}

export async function createPost({
  visibility,
  content,
}: Pick<PostEntity, "content" | "visibility">) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  const { data, error } = await api
    .from("posts")
    .insert({ content, visibility })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const userPost = await createPostUsers({
    id: data.id,
    user_nickname: currentUser.nickname,
  });

  if (!userPost) return;

  return data;
}
