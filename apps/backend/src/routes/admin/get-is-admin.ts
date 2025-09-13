import { getNickname } from "#lib/modules/context.ts";
import { validateAdmin } from "#lib/validators/validate-admin.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

export const getIsAdminRoute = new Hono()
  .get("/is-admin", async (ctx) => {
    const nickname = getNickname()

    try {
      const data = await validateAdmin(nickname)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })