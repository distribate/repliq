import { getNatsConnection } from "@repo/config-nats/nats-client"
import { forumDB } from "../shared/database/forum-db";
import type { AUTH } from "@repo/types/db/auth-database-types";
import type { Selectable } from "kysely";

async function notifyIssueReceived(session_id: string, nickname: string) {
  const nc = getNatsConnection()

  const notification = await forumDB
    .insertInto("notifications")
    .values({
      nickname,
      message: `Кто-то вошел в ваш аккаунт. ${session_id}`,
      type: "auth"
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return nc.publish(`forum.user.${nickname}.notifications`, JSON.stringify(notification))
}

export const publishAuthNotify = async (payload: { session_id: string, nickname: string }) => {

  await notifyIssueReceived(payload.session_id, payload.nickname)
}