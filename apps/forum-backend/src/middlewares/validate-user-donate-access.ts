import { getUserDonate } from "#lib/queries/user/get-user-donate.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { createMiddleware } from "hono/factory"

const RESTRICTED_GROUPS = ["default"]

export const validateUserDonateAccess = () => createMiddleware(async (ctx, next) => {
  const initiator = getNickname()
  const userDonate = await getUserDonate(initiator)

  if (RESTRICTED_GROUPS.includes(userDonate.donate)) {
    return ctx.json({ error: "You must donate to access this route" }, 401)  
  }

  await next()
})