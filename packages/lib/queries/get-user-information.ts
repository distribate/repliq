"use server";

import { getUserBanned } from './get-user-banned.ts';
import { CurrentUser } from './current-user-query.ts';
import { permanentRedirect } from 'next/navigation';
import { AUTH_REDIRECT, BANNED_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getCurrentSession } from '#actions/get-current-session.ts';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { redirect } from "next/navigation"

export async function getUserInformation(): Promise<CurrentUser> {
  const { user: currentUser } = await getCurrentSession();
  
  if (!currentUser) {
    return redirect(AUTH_REDIRECT)
  }
  
  const res = await forumUserClient.user["get-user"][":nickname"].$get({
    param: {
      nickname: currentUser.nickname
    }
  })

  const isBanned = await getUserBanned(currentUser.nickname);

  if (isBanned) {
    return permanentRedirect(BANNED_REDIRECT);
  }

  const { favorite_item, ...rest } = await res.json();
  
  return {
    ...rest,
    favorite_item: Number(favorite_item)
  }
}