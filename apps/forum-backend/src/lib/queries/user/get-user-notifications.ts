import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserNotifications(nickname: string) {
  return await forumDB
    .selectFrom('notifications')
    .select((eb) => [
      "id",
      "message",
      "nickname",
      "read",
      "type",
      eb.cast<string>('created_at', 'text').as('created_at')
    ])
    .where("nickname", "=", nickname)
    .orderBy("created_at", "desc")
    .execute();
}