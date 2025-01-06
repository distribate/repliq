import { DonateVariantsEnum } from '@repo/types/entities/entities-type.ts';
import { REDIRECT_USER_NOT_EXIST } from '@repo/shared/constants/routes.ts';
import { redirect } from 'next/navigation';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import type { UserDetailed } from '@repo/types/entities/user-type';

export type RequestedUser = UserDetailed

export async function getRequestedUser(currentUserNickname: string, requestedUserNickname: string) {
  const res = await forumUserClient().user["get-user"][":nickname"].$get({
    param: { nickname: requestedUserNickname }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return redirect(
      `${REDIRECT_USER_NOT_EXIST}${currentUserNickname}&timeout=5`,
    );
  }

  return data
}