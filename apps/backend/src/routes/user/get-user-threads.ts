import { Hono } from 'hono';
import * as z from "zod";
import { zValidator } from '@hono/zod-validator';
import { throwError } from '#utils/throw-error.ts';
import { getUserThreads } from '#lib/queries/user/get-user-threads.ts';
import { userPreferenceAndPrivateValidation } from '#utils/validate-user-preference-private.ts';
import { getNickname } from '#utils/get-nickname-from-storage.ts';

export const getUserThreadsSchema = z.object({
  searchQuery: z.string().optional(),
  cursor: z.string().optional(),
})

export const getUserThreadsRoute = new Hono()
  .get("/user-threads/:nickname", zValidator("query", getUserThreadsSchema), async (ctx) => {
    const recipient = ctx.req.param("nickname");
    const initiator = getNickname()
    const result = getUserThreadsSchema.parse(ctx.req.query());

    const isValid = await userPreferenceAndPrivateValidation({
      initiator, recipient
    })

    if (!isValid) {
      return ctx.json({ error: "User's profile is private" }, 400)
    }

    try {
      const data = await getUserThreads(recipient, result);

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });