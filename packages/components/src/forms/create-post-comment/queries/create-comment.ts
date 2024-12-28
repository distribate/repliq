"use server";

import "server-only";
import { PostCommentEntity } from "@repo/types/entities/entities-type.ts";
import { createClient } from '@repo/shared/api/supabase-client.ts';
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

type PostComment = Pick<PostCommentEntity, "content"> & {
  post_id: string;
};

async function validatePostComments(postId: string): Promise<boolean> {
  const api = createClient();

  const { data, error } = await api
    .from("posts")
    .select("isComments")
    .eq("id", postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.isComments as boolean;
}

export async function postComment({ content, post_id }: PostComment) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const isValid = await validatePostComments(post_id);
  if (!isValid) return;

  const api = createClient();

  const { error } = await api.from("posts_comments").insert({
    content,
    user_nickname: currentUser.nickname,
    post_id,
  });

  return !error;
}
