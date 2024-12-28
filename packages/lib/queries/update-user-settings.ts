'use server';

import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { getCurrentSession } from '#actions/get-current-session.ts';
import { z } from 'zod';
import { editUserSettingsBodySchema } from '@repo/types/schemas/user/edit-user-settings-schema.ts';

export type UpdateUserSettings = Omit<z.infer<typeof editUserSettingsBodySchema>, "userId">

export async function updateUserSettings(values: UpdateUserSettings) {
  const { user } = await getCurrentSession();
  if (!user) return null;
  
  const res = await forumUserClient.user['edit-user-settings'].$post({
    json: {
      userId: user.id,
      ...values
    },
  });
  
  const updatedSettings = await res.json();
  
  return updatedSettings
}