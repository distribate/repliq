"use server";

import "server-only";
import { createClient } from "@repo/lib/utils/api/supabase-client.ts";
import { validatePostOwner } from "#post/components/post-item/queries/validate-owner-post.ts";
import { PostEntity } from "@repo/types/entities/entities-type.ts";

export async function removePost({ id: postId }: Pick<PostEntity, "id">) {
  const isValid = await validatePostOwner({ postId });
  if (!isValid) return;

  const api = createClient();

  const { error } = await api.from("posts").delete().eq("id", postId);

  return !error;
}
