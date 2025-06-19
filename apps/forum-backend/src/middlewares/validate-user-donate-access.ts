import { getUserDonate } from "#lib/queries/user/get-user-donate.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { createMiddleware } from "hono/factory"

export const validateUserDonateAccess = () => createMiddleware(async (ctx, next) => {
  const initiator = getNickname()
  const isValid = await getUserDonate(initiator)

  if (!isValid) {
    return ctx.json({ error: "You must Fasberry+ to access this route" }, 401)  
  }

  await next()
})