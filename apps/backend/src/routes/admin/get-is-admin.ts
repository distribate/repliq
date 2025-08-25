import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { validateAdmin } from "#lib/validators/validate-admin.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

export const getIsAdminRoute = new Hono()
  .get("/get-is-admin", async (ctx) => {
    const nickname = getNickname()

    try {
      const isAdmin = await validateAdmin(nickname)

      ctx.header("Cache-Control", "public, max-age=120")

      return ctx.json({ data: isAdmin }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })