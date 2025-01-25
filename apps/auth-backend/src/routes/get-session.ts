import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { validateSessionToken } from "../utils/validate-session-token";
import { putSessionToken } from "../utils/put-session-token";

export const getSessionRoute = new Hono()
  .use(async (ctx, next) => {
    const sessionToken = getCookie(ctx, "session")

    // @ts-ignore
    ctx.set("t", sessionToken)

    await next()
  })
  .get("/get-session", async (ctx) => {
    // @ts-ignore
    const token = ctx.get("t") as string | undefined;

    if (!token) {
      return ctx.json({ error: "Unauthorized" }, 401)
    }

    try {
      const { session, user } = await validateSessionToken(token);

      if (!user || !session) {
        return ctx.json({ error: "Invalid session token" }, 401)
      }

      await putSessionToken(user.nickname, token)

      setCookie(ctx, `session`, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(session.expires_at),
        path: "/",
      })

      return ctx.json({ data: user }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
})