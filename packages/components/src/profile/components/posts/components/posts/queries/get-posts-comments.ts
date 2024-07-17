"use server"

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

export type PostComments = {
  post_id: string
}

type POST_COMMENT = Tables<'p_comments'>

export async function getPostsComments ({
  post_id
}: PostComments) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("posts_comments")
    .select("comment_id, p_comments(*)")
    .eq("post_id", post_id)
  
  if (error) throw new Error(error.message)
  
  const comments: POST_COMMENT[] = data.map(
    item => item.p_comments
  ).flat();
  
  return comments
}