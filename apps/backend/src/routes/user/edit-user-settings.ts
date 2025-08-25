import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '#utils/throw-error.ts';
import { updateSetting } from '#lib/queries/user/update-user-setting.ts';
import { editUserSettingsBodySchema } from '@repo/types/schemas/user/edit-user-settings-schema.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';

export const editUserSettingsRoute = new Hono()
  .post('/edit-user-settings', zValidator('json', editUserSettingsBodySchema), async (ctx) => {
    const result = editUserSettingsBodySchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const data = await updateSetting({ ...result, nickname });
      
      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });