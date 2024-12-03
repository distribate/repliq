"use server"

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

export async function postPostView(postId: string) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;
  
  const api = createClient();
  
  await api
  .from('posts_views')
  .insert({ user_id: currentUser.id, post_id: postId, })
}