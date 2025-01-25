import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { z } from 'zod';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';

export type GetPosts = Omit<z.infer<typeof getUserPostsSchema>, 'currentUserNickname'> & {
  requestedUserNickname: string
}

export async function getPosts({
  requestedUserNickname, ascending = false, searchQuery, filteringType, range
}: GetPosts) {
  const res = await forumUserClient.user['get-user-posts'][':nickname'].$get({
    query: {
      ascending: ascending.toString(),
      searchQuery,
      filteringType,
      range: `${range[0]},${range[1]}`
    },
    param: {
      nickname: requestedUserNickname,
    },
  });
  
  const data = await res.json();
  
  if (!data || 'error' in data) {
    console.log(data?.error)
    return { data: null, meta: { count: 0 } };
  }
  
  return data;
}