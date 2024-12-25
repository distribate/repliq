'use server';

import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';
import { forumUserClient } from '@repo/lib/utils/api/forum-client.ts';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';

export type GetPosts = Omit<z.infer<typeof getUserPostsSchema>, 'currentUserNickname'> & {
  requestedUserNickname: string
}

export async function getPosts({
  requestedUserNickname, ascending = false, searchQuery, filteringType, range
}: GetPosts) {
  const { user: currentUser } = await getCurrentSession();
  
  if (!currentUser) {
    redirect(AUTH_REDIRECT);
  }
  
  const { nickname: currentUserNickname } = currentUser;
  
  const res = await forumUserClient.user['get-user-posts'][':nickname'].$get({
    query: {
      currentUserNickname,
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