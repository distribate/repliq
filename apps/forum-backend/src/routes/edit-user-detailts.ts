import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { updateUserDetails } from '#lib/queries/update-user-details.ts';
import { throwError } from '#helpers/throw-error.ts';
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema.ts';

export const editUserDetailsRoute = new Hono()
.post('/edit-user-details', zValidator('json', userDetailsSchema), async(ctx) => {
  const body = await ctx.req.json();
  const result = userDetailsSchema.parse(body);
  
  let updatedValue;
  
  try {
    updatedValue = await updateUserDetails(result);
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 401);
  }
  
  return ctx.json(updatedValue, 200);
});