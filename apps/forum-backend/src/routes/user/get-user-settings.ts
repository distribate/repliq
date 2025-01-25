import { Hono } from 'hono';
import { getUserSettings } from '#lib/queries/user/get-user-setting.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';

export const getUserSettingsRoute = new Hono()
  .get("/get-user-settings", async (ctx) => {
    const nickname = getNickname();

    try {
      const settingValue = await getUserSettings(nickname)

      return ctx.json({ data: settingValue }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })