import { forumDB } from "#shared/database/forum-db.ts";

export async function updateWebsocketToken(nickname: string) {
  return await forumDB
    .updateTable("websocket_tokens")
    .set({
      token: ""
    })
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()
}