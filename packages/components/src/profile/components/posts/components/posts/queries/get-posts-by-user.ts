'use server';

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { checkIsFriend } from '@repo/lib/helpers/check-is-friend.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

type GetPostsByUser = Partial<{
  nickname: string,
  limit: number,
  ascending: boolean
}>

export type PostsByUser = PostEntity & {
  commentsCount: number
}

export async function getPostsByNickname({
  nickname, limit, ascending = false,
}: GetPostsByUser): Promise<PostsByUser[] | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !nickname) return null;
  
  const api = createClient();
  
  let query = api
  .from('posts_users')
  .select(`
    posts:posts!inner(
      id,
      created_at,
      content,
      visibility,
      isComments,
      comments:posts_comments(count)
    )
	`)
  .order('created_at', { ascending })
  .eq('user_nickname', nickname)
  .returns<{ posts: PostsByUser & { comments: Array<{ count: number }> } }[]>();
  
  if (limit) {
    query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  const isFriend = await checkIsFriend(nickname);

  return data
  .map(item => {
    const { comments, ...postWithoutComments } = item.posts;
    
    return {
      ...postWithoutComments,
      commentsCount: comments && comments.length > 0 ? comments[0].count : 0,
    };
  })
  .filter(post => {
    return (
      currentUser.nickname === nickname ||
      post.visibility === 'all' ||
      (isFriend && post.visibility === 'friends')
    );
  });
}