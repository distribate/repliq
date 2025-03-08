import { z } from 'zod';
import type { UsersSettings } from '../../db/forum-database-types.ts';

export type UserSettingsKeys = keyof Omit<UsersSettings, 'id' | 'user_id'>

export const userSettings = [
  'accept_friend_request',
  'cover_outline_visible',
  'real_name_visible',
  'game_stats_visible',
  "profile_visibility",
  "send_notifications"
] satisfies readonly [ UserSettingsKeys, ...UserSettingsKeys[] ];

export const editUserSettingsBodySchema = z.object({
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