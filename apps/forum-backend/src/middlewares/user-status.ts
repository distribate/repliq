import { publishUserStatus } from "#publishers/pub-user-status.ts"
import { createMiddleware } from "hono/factory"

export const userStatus = createMiddleware(async (ctx, next) => {
  const nickname = ctx.get("nickname")
  const route = ctx.req.path

  console.log(route)

  publishUserStatus(nickname)

  await next()
})