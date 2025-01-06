import type { deleteFriendSchema } from "#routes/friend/delete-friend.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import type { z } from "zod";

type DeleteFriend = z.infer<typeof deleteFriendSchema> & {
  currentUserNickname: string
}

export async function deleteFriend({
  friend_id, currentUserNickname,
}: DeleteFriend) {
  return await forumDB
    .deleteFrom('users_friends')
    .where("id", "=", friend_id)
    .where((eb) => eb.or([
      eb('user_1', '=', currentUserNickname),
      eb('user_2', '=', currentUserNickname),
    ]))
    .execute();
}