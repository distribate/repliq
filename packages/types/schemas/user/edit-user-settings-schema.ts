import { z } from 'zod';
import { userSettings } from 'forum-backend/src/shared/user-settings.ts';

export const editUserSettingsBodySchema = z.object({
  userId: z.string(),
  setting: z.enum(userSettings),
  value: z.union([
    z.boolean(),
    z.enum(["all", "friends"]),
  ])
}).refine(data => {
  if (data.setting === 'profile_visibility') {
    if (typeof data.value === 'boolean') {
      return false;
    }
    
    return ['all', 'friends'].includes(data.value);
  }

  return typeof data.value === 'boolean';
}, {
  message: 'Invalid value for the setting.',
  path: ['value'],
});