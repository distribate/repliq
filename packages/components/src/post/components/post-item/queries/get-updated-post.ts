'use server';

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { PostEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import { OverridedPosts } from '#profile/components/posts/components/posts/queries/get-posts.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

type GetUpdatedPost = Pick<PostEntity, 'id'>
  & Pick<UserEntity, 'nickname'>

type UpdatedPost = OverridedPosts

type PostViews = {
  isViewed: Array<{
    user_id: string
  }>,
  views_count: number,
  comments_count: number
}

export async function getUpdatedPost({
  nickname, id,
}: GetUpdatedPost): Promise<UpdatedPost | null> {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;
  
  const api = createClient();
  
  const { data: views } = await api
  .from('posts_with_comments_and_view_counts')
  .select(`
    *,
    isViewed: posts_views(user_id)
  `, { count: 'exact' })
  .eq('user_nickname', nickname)
  .eq('id', id)
  .single()
  
  const { data, error } = await api
  .from('posts')
  .select()
  .eq('id', id)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  const postViews = views as PostViews;
  
  const isViewed = Array.isArray(postViews)
    && postViews.isViewed.some(view => view.user_id === currentUser.id);

  return {
    ...data, isViewed,
    views_count: views.views_count,
    user_nickname: nickname,
    comments_count: views.comments_count,
  };
}