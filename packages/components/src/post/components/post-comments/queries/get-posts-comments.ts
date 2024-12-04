"use server";

import {
  PostCommentEntity,
  PostEntity,
} from "@repo/types/entities/entities-type.ts";
import { createClient } from "../../../../../../lib/utils/api/supabase-client.ts";

export type GetPostsComments = Pick<PostEntity, "id"> &
  Partial<{
    order: "created_at" | "rating";
    limit: number;
    range: number[];
    ascending: boolean;
  }>;

export async function getPostsComments({
  range,
  ascending,
  limit,
  order,
  id,
}: GetPostsComments): Promise<PostCommentEntity[]> {
  const api = createClient();

  let query = api.from("posts_comments").select().eq("post_id", id);

  if (range) query = query.range(range[0], range[1]);

  if (ascending && order) {
    if (order === "created_at") {
      query = query.order(order, { ascending });
    }

    // todo: ordering by comment rating
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
