import { forumDB } from "#shared/database/forum-db.ts";

export async function createFriendRequest(currentUserNickname: string, requestedUserNickname: string) {
    return await forumDB
      .insertInto('friends_requests')
      .values({
        initiator: currentUserNickname,
        recipient: requestedUserNickname
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  