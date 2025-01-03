import { z } from 'zod';
import { forumDB } from '#shared/database/forum-db.ts';
import type { editUserSettingsBodySchema } from '@repo/types/schemas/user/edit-user-settings-schema.ts';

export async function updateSetting({
  userId, setting, value,
}: z.infer<typeof editUserSettingsBodySchema>) {
  return await forumDB
  .updateTable('users_settings')
  .set(setting, value)
  .where('user_id', '=', userId)
  .returning(setting)
  .executeTakeFirstOrThrow();
}