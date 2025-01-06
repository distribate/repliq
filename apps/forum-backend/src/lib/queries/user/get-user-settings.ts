import { forumDB } from "#shared/database/forum-db.ts";
import { userSettings } from '../../../shared/constants/user-settings.ts';

export async function getUserSettings(userId: string) {
  return await forumDB
    .selectFrom('users_settings')
    .where('user_id', '=', userId)
    .select(userSettings)
    .executeTakeFirstOrThrow();
}