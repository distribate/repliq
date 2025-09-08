import * as z from "zod";
import { forumDB } from '#shared/database/forum-db.ts';
import type { editUserSettingsBodySchema } from '@repo/types/schemas/user/edit-user-settings-schema.ts';

type UpdateUserSetting = z.infer<typeof editUserSettingsBodySchema>

export async function updateSetting(
  nickname: string,
  { setting, value }: UpdateUserSetting
) {
  return forumDB
    .updateTable('users_settings')
    .set(setting, value)
    .where('nickname', '=', nickname)
    .returning(setting)
    .executeTakeFirstOrThrow();
}