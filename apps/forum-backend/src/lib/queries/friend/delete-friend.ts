import { forumDB } from "#shared/database/forum-db.ts";
import type { deleteFriendSchema } from "@repo/types/schemas/friend/delete-friend-schema";
import type { z } from "zod";

type DeleteFriend = z.infer<typeof deleteFriendSchema> & {
  nickname: string
}

export async function deleteFriend({
  friend_id, nickname,
}: DeleteFriend) {
  return await forumDB
    .deleteFrom('users_friends')
    .where("id", "=", friend_id)
    .where((eb) => eb.or([
      eb('user_1', '=', nickname),
      eb('user_2', '=', nickname),
    ]))
    .execute();
}