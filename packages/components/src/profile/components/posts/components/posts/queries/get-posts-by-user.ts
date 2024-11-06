'use server';

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { checkIsFriend } from '@repo/lib/helpers/check-is-friend.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { PostEntity, RequestDetails } from '@repo/types/entities/entities-type.ts';

export type GetPostsByUser = Partial<{
  nickname: string
}> & RequestDetails

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
  
  return data.map(item => {
    const { comments, ...postWithoutComments } = item.posts;
    const commentsCount = comments && comments.length > 0 ? comments[0].count : 0
    
    return { ...postWithoutComments, commentsCount, };
  })
  .filter(post => {
    switch (post.visibility) {
      case 'all':
        return true;
      case 'only':
        return currentUser.nickname === nickname;
      case 'friends':
        return isFriend;
      default:
        return false;
    }
  });
}