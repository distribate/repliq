import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { updateUserDetails } from '#lib/queries/user/update-user-details.ts';
import { throwError } from '#utils/throw-error.ts';
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';

export const editUserDetailsRoute = new Hono()
  .post('/edit-user-details', zValidator('json', userDetailsSchema), async (ctx) => {
    const result = userDetailsSchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const data = await updateUserDetails({ ...result, nickname });

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });