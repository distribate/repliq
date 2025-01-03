import { forumDB } from "#shared/database/forum-db.ts"

export async function deleteFriendRequest(nickname: string, friend_id: string) {
    return await forumDB
      .deleteFrom('friends_requests')
      .where("id", "=", friend_id)
      .where((eb) => eb.or([
        eb('initiator', '=', nickname),
        eb('recipient', '=', nickname),
      ]))
      .execute();
  }
  