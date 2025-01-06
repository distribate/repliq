import { forumDB } from "#shared/database/forum-db.ts";

type GetFriendRequests = {
  nickname: string;
  type: "incoming" | "outgoing"
}

export const getFriendRequests = async ({
  nickname, type
}: GetFriendRequests) => {
  return await forumDB
    .selectFrom('friends_requests')
    .selectAll()
    .where(type === "incoming" ? "recipient" : "initiator", '=', nickname)
    .execute();
}