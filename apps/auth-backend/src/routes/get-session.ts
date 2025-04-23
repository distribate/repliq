import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { validateSessionToken } from "../utils/validate-session-token";
import type { Env } from "../types/env-type";
import { getNicknameByTokenFromKv } from "../utils/get-nickname-by-token-from-kv";
import { isProduction } from "@repo/lib/helpers/is-production";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details";

export const getSessionRoute = new Hono<Env>()
  .use(async (ctx, next) => {
    const sessionToken = getCookie(ctx, SESSION_KEY)

    console.log(sessionToken)

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

      console.log(nickname)

      if (!nickname) {
        const { session, user } = await validateSessionToken(token);

        if (!user || !session) {
          return ctx.json({ error: "Invalid session token" }, 401)
        }

        setCookie(ctx, SESSION_KEY, token, {
          httpOnly: true,
          sameSite: "lax",
          domain: SESSION_DOMAIN,
          secure: isProduction,
          expires: new Date(session.expires_at),
          path: "/",
        })
      }

      return ctx.json({ data: nickname }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })