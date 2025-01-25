import { Hono } from 'hono';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getBlockedUsers } from '#lib/queries/user/get-blocked-users.ts';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const getBlockedUsersSchema = z.object({
  cursor: z.string().optional()
})

export const getBlockedUsersRoute = new Hono()
  .get("/get-blocked-users/:nickname", zValidator("query", getBlockedUsersSchema), async (ctx) => {
    const { nickname } = ctx.req.param()
    const { cursor } = getBlockedUsersSchema.parse(ctx.req.query())

    try {
      const blockedUsers = await getBlockedUsers({
        cursor: Number(cursor) ?? null, nickname
      })
      
      return ctx.json({ data: blockedUsers }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })