import { Hono } from 'hono';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getBlockedUsers } from '#lib/queries/user/get-blocked-users.ts';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getNickname } from '#utils/get-nickname-from-storage.ts';

const getBlockedUsersSchema = z.object({
  cursor: z.string().optional()
})

export const getBlockedUsersRoute = new Hono()
  .get("/get-blocked-users", zValidator("query", getBlockedUsersSchema), async (ctx) => {
    const nickname = getNickname()
    const { cursor } = getBlockedUsersSchema.parse(ctx.req.query())

    try {
      const blockedUsers = await getBlockedUsers({ cursor, nickname })

      return ctx.json(blockedUsers, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })