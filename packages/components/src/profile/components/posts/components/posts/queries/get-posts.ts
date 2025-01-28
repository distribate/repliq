import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { z } from 'zod';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';

export type GetPosts = Omit<z.infer<typeof getUserPostsSchema>, 'currentUserNickname'> & {
  nickname: string
}

export async function getPosts({
  nickname, ascending = false, filteringType, cursor
}: GetPosts) {
  const res = await forumUserClient.user['get-user-posts'][':nickname'].$get({
    query: {
      ascending: ascending.toString(),
      filteringType,
      cursor
    },
    param: {
      nickname,
    },
  });

  const data = await res.json();

  if (!data || 'error' in data) {
    return null
  }

  return data;
}