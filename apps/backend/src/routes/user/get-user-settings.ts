import { Hono } from 'hono';
import { throwError } from '#utils/throw-error.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';
import { forumDB } from '#shared/database/forum-db.ts';
import { userSettings } from '#shared/constants/user-settings.ts';

async function getUserSettings(nickname: string) {
  return forumDB
    .selectFrom("users_settings")
    .select(userSettings)
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()
}

export const getUserSettingsRoute = new Hono()
  .get("/user-settings", async (ctx) => {
    const nickname = getNickname();

    try {
      const data = await getUserSettings(nickname)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })