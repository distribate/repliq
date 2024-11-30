"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '../../../../../../lib/utils/api/supabase-client.ts';

export async function postPostView(postId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  await api
  .from('posts_views')
  .insert({ user_id: currentUser.id, post_id: postId, })
}