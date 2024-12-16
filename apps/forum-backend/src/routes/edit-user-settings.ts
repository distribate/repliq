import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { throwError } from '#helpers/throw-error.ts';
import { updateSetting } from '#lib/queries/update-user-setting.ts';
import { editUserSettingsBodySchema } from '@repo/types/schemas/user/edit-user-settings-schema.ts';

export const editUserSettingsRoute = new Hono()
.post('/edit-user-settings', zValidator('json', editUserSettingsBodySchema), async(ctx) => {
  const body = await ctx.req.json();
  const result = editUserSettingsBodySchema.parse(body);
  
  let updatedValue;
  
  try {
    updatedValue = await updateSetting(result);
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
  
  return ctx.json(updatedValue, 200);
});