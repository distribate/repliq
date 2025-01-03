import { forumDB } from "#shared/database/forum-db.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import type { Issues } from "@repo/types/db/forum-database-types";
import type { Selectable } from "kysely";

async function notifyIssueReceived(nickname: string, issueTitle: string) {
  const nc = getNatsConnection()

  const notification = await forumDB
    .insertInto("notifications")
    .values({
      nickname,
      message: `Ваша заявка ${issueTitle.slice(0, 16)} была создана`,
      type: "issue"
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return nc.publish(`forum.user.${nickname}.notifications`, JSON.stringify(notification))
}

export const publishIssuePayload = async (payload: Selectable<Issues>) => {
  const nc = getNatsConnection()
  
  await notifyIssueReceived(payload.user_nickname, payload.title)
  
  return nc.publish("forum.issue.created", JSON.stringify(payload))
}