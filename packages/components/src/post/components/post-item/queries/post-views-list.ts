'use server';

import { validatePostOwner } from '#post/components/post-item/queries/validate-owner-post.ts';
import { createClient } from '../../../../../../lib/utils/api/supabase-client.ts';

export async function getPostViewsUsers(postId: string) {
  const isValid = await validatePostOwner({ postId });
  if (!isValid) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('posts_views')
  .select(`
      created_at,
      users: users!inner(nickname)
    `)
  .eq('post_id', postId)
  .order("created_at", { ascending: false })
  .returns<{ created_at: string, users: { nickname: string } }[]>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(({ created_at, users }) => ({
    created_at, ...users,
  }));
}