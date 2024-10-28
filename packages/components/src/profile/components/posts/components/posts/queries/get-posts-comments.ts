"use server"

import { PostCommentEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

export type PostComments = {
  post_id: string
}

export async function getPostsComments (
  post_id: PostComments["post_id"]
): Promise<PostCommentEntity[]> {
  const api = createClient();
  
  const { data, error } = await api
    .from("posts_comments_ref")
    .select("comment_id, posts_comments(*)")
    .eq("post_id", post_id)
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.flatMap(item => item.posts_comments);
}