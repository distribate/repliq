import { forumDB } from "#shared/database/forum-db.ts";

export async function getWebsocketToken(nickname: string) {
  return await forumDB
    .selectFrom("websocket_tokens")
    .select("token")
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()
}