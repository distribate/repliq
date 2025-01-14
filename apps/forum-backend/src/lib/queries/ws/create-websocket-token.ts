import { forumDB } from "#shared/database/forum-db.ts";

export async function createWebsocketToken(nickname: string, token: string) {
  return await forumDB
    .insertInto("websocket_tokens")
    .values({
      token, nickname
    })
    .onConflict((oc) => oc.column("nickname").doUpdateSet({ token }))
    .execute()
}