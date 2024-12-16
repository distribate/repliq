import { Hono } from 'hono';
import { throwError } from '#helpers/throw-error.ts';
import { getBlockedUsers } from '#lib/queries/get-blocked-users.ts';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const getBlockedUsersSchema = z.object({
  cursor: z.string().optional()
})

export const getBlockedUsersRoute = new Hono()
.get("/get-blocked-users/:nickname", zValidator("query", getBlockedUsersSchema), async (ctx) => {
  const { nickname } = ctx.req.param()
  const { cursor } = getBlockedUsersSchema.parse(ctx.req.query())
  
  let blockedUsers;
  
  try {
    blockedUsers = await getBlockedUsers({
      cursor: Number(cursor) ?? null, nickname
    })
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 401)
  }
  
  return ctx.json(blockedUsers, 200)
})