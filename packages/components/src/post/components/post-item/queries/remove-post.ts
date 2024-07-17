"use server"

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

type RemovePost = {
  post_id: string,
  nickname: string
}

export async function removePost({
  post_id, nickname
}: RemovePost) {
  const supabase = createClient();
  
  const currentUser = await getCurrentUser()
  
  if (!currentUser) return;
  
  const { data: postCreator, error: postCreatorError } = await supabase
    .from("posts_users")
    .select("user_nickname")
    .eq("post_id", post_id)
    .single()
  
  if (postCreatorError) {
    throw new Error(postCreatorError.message)
  }
  
  if (postCreator.user_nickname !== nickname) return;
  
  try {
    const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("post_id", post_id)
    
    if (error) console.error(error.message)
    
    return data;
  } catch (e) {
    console.error(e)
  }
}