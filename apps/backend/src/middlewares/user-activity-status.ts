import { publishUserActivityStatus } from "#publishers/pub-user-status.ts"
import { getNickname } from "#lib/modules/context.ts";
import { createMiddleware } from "hono/factory"

export const userActivityStatus = () => createMiddleware(async (_, next) => {
  const nickname = getNickname(true)

  if (!nickname) {
    throw new Error("Nickname is not defined")
  }

  publishUserActivityStatus(nickname)

  await next()
})