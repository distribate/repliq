import { Hono } from 'hono';
import * as z from "zod";
import { zValidator } from '@hono/zod-validator';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getUserThreads } from '#lib/queries/user/get-user-threads.ts';
import { userPreferenceAndPrivateValidation } from '#utils/validate-user-preference-private.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';

export const getUserThreadsSchema = z.object({
  querySearch: z.string().optional(),
  cursor: z.string().optional(),
})

export const getUserThreadsRoute = new Hono()
  .get("/get-user-threads/:nickname", zValidator("query", getUserThreadsSchema), async (ctx) => {
    const { nickname: recipient } = ctx.req.param();
    const initiator = getNickname()
    const result = getUserThreadsSchema.parse(ctx.req.query());

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const threads = await getUserThreads({ nickname: recipient, ...result });

      return ctx.json(threads, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });