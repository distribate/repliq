import { DonateVariantsEnum } from '@repo/types/entities/entities-type.ts';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import type { UserDetailed } from '@repo/types/entities/user-type';

export type RequestedUser = UserDetailed

export async function getRequestedUser(requestedUserNickname: string) {
  const res = await forumUserClient.user["get-user"][":nickname"].$get({
    param: { nickname: requestedUserNickname }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return "not-exist"
  }

  return data.data
}