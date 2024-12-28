"use server";

import { DonateVariantsEnum, UserEntity } from '@repo/types/entities/entities-type.ts';
import { REDIRECT_USER_NOT_EXIST } from '@repo/shared/constants/routes.ts';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '#actions/get-current-session.ts';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { CurrentUser } from '#queries/current-user-query.ts';

export type RequestedUser = Omit<UserEntity, "acceptrules"> & {
  donate: DonateVariantsEnum
} & Pick<CurrentUser, "preferences">

async function getMainData(nickname: string) {
  return await forumUserClient.user["get-user"][":nickname"].$get({
    param: { nickname }
  })
}

export async function getRequestedUser(
  nickname: string
) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;

  const res = await getMainData(nickname)
 
  if (!res) {
    return redirect(
      `${REDIRECT_USER_NOT_EXIST}${currentUser.nickname}&timeout=5`,
    );
  }

  const { favorite_item, ...rest } = await res.json()
  
  return {
    ...rest,
    favorite_item: Number(favorite_item)
  }
}