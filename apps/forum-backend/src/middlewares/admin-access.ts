import { validateAdmin } from "#routes/admin/get-is-admin.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { createMiddleware } from "hono/factory"

export const adminMiddleware = createMiddleware(async (ctx, next) => {
  const nickname = getNickname()

  const isAdmin = await validateAdmin(nickname)

  if (!isAdmin) return ctx.json({ error: "Unauthorized" }, 401)

  await next()
})
