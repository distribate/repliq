import { forumDB } from "#shared/database/forum-db.ts";

type UpdateNotification = {
  nickname: string
  notificationId: string
}

export async function updateNotification({
  nickname, notificationId
}: UpdateNotification) {
  return await forumDB
    .updateTable("notifications")
    .set({ read: true })
    .where("id", "=", notificationId)
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow();
}
