import { getUserDonate } from "#lib/queries/user/get-user-donate.ts"
import { getNickname } from "#lib/modules/context.ts"
import { createMiddleware } from "hono/factory"

export const requirePremiumAccess = () => createMiddleware(async (ctx, next) => {
  const nickname = getNickname()
  const isValid = await getUserDonate(nickname)

  if (!isValid) {
    return ctx.json({ error: "You must Repliq+ to access this route" }, 401)  
  }

  await next()
})