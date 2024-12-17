"use server";

import { validatePostOwner } from "#post/components/post-item/queries/validate-owner-post.ts";
import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

type PinPost = Pick<UserPostItem, "id" | "isPinned">

export async function pinPost({ id: postId, isPinned }: PinPost) {
  const isValid = await validatePostOwner({ postId });
  if (!isValid) return;

  const api = createClient();

  const { error } = await api
    .from("posts")
    .update({
      isPinned: !isPinned,
    })
    .eq("id", postId);

  return !error;
}
