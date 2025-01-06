
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { z } from 'zod';
import { editUserSettingsBodySchema } from '@repo/types/schemas/user/edit-user-settings-schema.ts';

export type UpdateUserSettings = Omit<z.infer<typeof editUserSettingsBodySchema>, "userId">

export async function updateUserSettings(values: UpdateUserSettings) {
  const res = await forumUserClient().user['edit-user-settings'].$post({
    json: values
  });

  const updatedSettings = await res.json();

  return updatedSettings
}