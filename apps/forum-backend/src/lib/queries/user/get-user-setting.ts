import { forumDB } from '#shared/database/forum-db.ts';
import { userSettings } from '#shared/constants/user-settings.ts';

export async function getUserSettings(nickname: string) {
  return await forumDB
    .selectFrom("users_settings")
    .select(userSettings)
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()
}