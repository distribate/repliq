import { forumDB } from '@repo/shared/db/forum-db.ts';
import { z } from 'zod';
import { getUserSettingsSchema } from '#routes/get-user-settings.ts';
import { userSettings } from '#shared/user-settings.ts';

type GetUserSettings = z.infer<typeof getUserSettingsSchema>

export async function getUserSettings({
  userId
}: GetUserSettings) {
  return await forumDB.selectFrom("users_settings")
  .select(userSettings)
  .where("user_id", "=", userId)
  .executeTakeFirstOrThrow()
}