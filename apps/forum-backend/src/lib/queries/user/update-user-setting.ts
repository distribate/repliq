import { z } from 'zod/v4';
import { forumDB } from '#shared/database/forum-db.ts';
import type { editUserSettingsBodySchema } from '@repo/types/schemas/user/edit-user-settings-schema.ts';

type UpdateUserSetting = z.infer<typeof editUserSettingsBodySchema> & {
  nickname: string;
}

export async function updateSetting({
  setting, value, nickname
}: UpdateUserSetting) {
  return forumDB
    .updateTable('users_settings')
    .set(setting, value)
    .where('nickname', '=', nickname)
    .returning(setting)
    .executeTakeFirstOrThrow();
}