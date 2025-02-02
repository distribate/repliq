import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { validateSessionToken } from "../utils/validate-session-token";
import type { Env } from "../types/env-type";
import { getNicknameByTokenFromKv } from "../utils/get-nickname-by-token-from-kv";

export const getSessionRoute = new Hono<Env>()
  .use(async (ctx, next) => {
    const sessionToken = getCookie(ctx, "session")

    if (!sessionToken) {
      return ctx.json({ error: "Unauthorized" }, 401)
    }

    // @ts-ignore
    ctx.set("sessionToken", sessionToken)

    await next()
  })
  .get("/get-session", async (ctx) => {
    const token = ctx.get("sessionToken")

    try {
      const nickname = await getNicknameByTokenFromKv(token);

      if (!nickname) {
        const { session, user } = await validateSessionToken(token);

        if (!user || !session) {
          return ctx.json({ error: "Invalid session token" }, 401)
        }

        setCookie(ctx, `session`, token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          expires: new Date(session.expires_at),
          path: "/",
        })
      }

      return ctx.json({ data: nickname }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })