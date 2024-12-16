import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getUserSettings } from '#lib/queries/get-user-setting.ts';
import { throwError } from '#helpers/throw-error.ts';
import { z } from 'zod';

export const getUserSettingsSchema = z.object({
  userId: z.string()
})

export const getUserSettingsRoute = new Hono()
.get("/get-user-settings", zValidator("query", getUserSettingsSchema), async (ctx) => {
  const query = ctx.req.query()
  const result = getUserSettingsSchema.parse(query)
  
  let settingValue;
  
  try {
    settingValue = await getUserSettings(result)
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
  
  return ctx.json(settingValue, 200)
})