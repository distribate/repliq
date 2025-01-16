import type { UsersSettings } from '@repo/types/db/forum-database-types.ts';

export type UserSettingsKeys = keyof Omit<UsersSettings, 'id' | 'user_id'>

export const userSettings = [
  'accept_friend_request',
  'cover_outline_visible',
  'real_name_visible',
  'game_stats_visible',
  "profile_visibility",
  "send_notifications"
] satisfies readonly [ UserSettingsKeys, ...UserSettingsKeys[] ];