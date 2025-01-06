import { getUserDonate } from "#lib/queries/user/get-user-donate.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { createMiddleware } from "hono/factory"

export const validateUserDonateAccess = createMiddleware(async (ctx, next) => {
  const initiator = getNickname()

  // check initiator donate
  const userDonate = await getUserDonate(initiator)

  if (userDonate.donate !== 'default') {
    await next()
  }

  return ctx.json({ error: "You must donate to access this route" }, 401)
})