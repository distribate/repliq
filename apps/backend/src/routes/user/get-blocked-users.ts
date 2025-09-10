import { Hono } from 'hono';
import { throwError } from '#utils/throw-error.ts';
import { getBlockedUsers } from '#lib/queries/user/get-blocked-users.ts';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getNickname } from '#lib/modules/context.ts';
import { getUserIsBlocked } from '#lib/queries/user/get-user-is-blocked.ts';

const getBlockedUsersSchema = z.object({
  cursor: z.string().optional()
})

export const getUserIsBlockedRoute = new Hono()
  .get("/user-is-blocked/:nickname", async (ctx) => {
    const nickname = getNickname()
    const recipient = ctx.req.param("nickname")

    try {
      const blockedUserStatus = await getUserIsBlocked({ initiator: nickname, recipient })

      return ctx.json<{ data: "blocked-by-you" | "blocked-by-user" | null }>({ data: blockedUserStatus }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })

export const getBlockedUsersRoute = new Hono()
  .get("/blocked-users", zValidator("query", getBlockedUsersSchema), async (ctx) => {
    const nickname = getNickname()
    const result = getBlockedUsersSchema.parse(ctx.req.query())

    try {
      const data = await getBlockedUsers(nickname, result)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })