"use server";

import { createClient } from "@repo/shared/api/supabase-client.ts";
import { PostCommentEntity } from "@repo/types/entities/entities-type.ts";

export type RemovePostComment = Pick<PostCommentEntity, "id">;

export async function removePostComment({ id }: RemovePostComment) {
  const api = createClient();

  const { error } = await api.from("posts_comments").delete().eq("id", id);

  return !error;
}
