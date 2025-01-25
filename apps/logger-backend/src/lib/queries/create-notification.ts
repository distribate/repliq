import { forumDB } from "../../shared/database/forum-db";

type CreateNotification = {
  nickname: string
  message: string
  type: string
}

export async function createNotification({ nickname, message, type }: CreateNotification) {
  return await forumDB
    .insertInto("notifications")
    .values({ nickname, message, type })
    .returningAll()
    .executeTakeFirstOrThrow();
}