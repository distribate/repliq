import { Hono } from 'hono';
import { forumDB } from '../shared/db.ts';
import { userSettings } from '../shared/user-settings.ts';
import type { UserDonateVariant } from '@repo/types/entities/entities-type.ts';

async function getUserMain(nickname: string) {
  return forumDB
  .selectFrom('users')
  .selectAll()
  .where('nickname', '=', nickname)
  .executeTakeFirstOrThrow();
}

async function getUserSettings(userId: string) {
  return await forumDB
  .selectFrom('users_settings')
  .where('user_id', '=', userId)
  .select(userSettings)
  .executeTakeFirstOrThrow();
}

async function getUser(nickname: string) {
  let requestedUser;
  
  const userQuery = await getUserMain(nickname);
  const settingsQuery = await getUserSettings(userQuery.id)
  
  const { real_name_visible } = settingsQuery;
  
  const isIdentity = nickname === userQuery.nickname
  
  if (real_name_visible === false && !isIdentity) {
    const { real_name, ...withoutRealName } = userQuery;
    
    requestedUser = {
      ...withoutRealName,
      real_name: null,
      donate: withoutRealName.donate satisfies UserDonateVariant,
      preferences: settingsQuery,
    };
  } else {
    requestedUser = {
      ...userQuery,
      donate: userQuery.donate satisfies UserDonateVariant,
      preferences: settingsQuery,
    };
  }
  
  return requestedUser;
}

export const getUserRoute = new Hono()
.get('/get-user/:nickname', async(ctx) => {
  const { nickname } = ctx.req.param();
  
  const user = await getUser(nickname);
  
  return ctx.json(user, 200);
});