"use server";

import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { validatePostOwner } from "#post/components/post-item/queries/validate-owner-post.ts";
import { PostEntity } from "@repo/types/entities/entities-type.ts";

type DisablePostComments = Pick<PostEntity, "id"> & {
  isComments: boolean;
};

export async function disablePostComments({
  id: postId,
  isComments,
}: DisablePostComments) {
  const isValid = await validatePostOwner({ postId });
  if (!isValid) return;

  const api = createClient();

  const { error } = await api
    .from("posts")
    .update({ isComments: !isComments })
    .eq("id", postId);

  return !error;
}
