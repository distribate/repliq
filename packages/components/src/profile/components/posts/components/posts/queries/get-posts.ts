'use server';

import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';
import { forumUserClient } from '@repo/lib/utils/api/forum-client.ts';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';

export type GetPosts = Omit<z.infer<typeof getUserPostsSchema>, "currentUserNickname"> & {
  requestedUserNickname: string
}

export async function getPosts({
  requestedUserNickname, limit, ascending = false, searchQuery, filteringType, range,
}: GetPosts) {
  const { user: currentUser } = await getCurrentSession();
  
  if (!currentUser) {
    redirect(AUTH_REDIRECT);
  }
  
  const res = await forumUserClient.user['get-user-posts'][':nickname'].$get({
    query: {
      currentUserNickname: currentUser.nickname
    },
    param: {
      nickname: requestedUserNickname,
    },
  });
  
  const data = await res.json();
  
  if (!data || 'error' in data) {
    return { data: null, meta: { count: 0 }, };
  }
  
  return data;
}