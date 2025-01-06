import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { forumUserClient } from "@repo/shared/api/forum-client.ts";

export async function getUserMainInformation({ 
  nickname 
}: Pick<UserEntity, "nickname">) {
  const res = await forumUserClient().user["get-user-summary"][":nickname"].$get({
    param: { nickname },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data
}