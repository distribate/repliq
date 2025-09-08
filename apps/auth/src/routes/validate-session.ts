import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details";
import type { Env } from "../types/env-type";
import { getSession } from "../utils/auth";
import { isProduction } from "#helpers/is-production.ts";

export const validateSessionRoute = new Hono<Env>()
  .get("/validate-session", async (ctx) => {
    const token = getCookie(ctx)[SESSION_KEY]

    if (!token) {
      return ctx.json({ data: false }, 200)
    }

    try {
      const session = await getSession(token);

      if (!session) {
        return ctx.json({ data: false }, 200)
      }

      setCookie(ctx, SESSION_KEY, token, {
        httpOnly: true,
        sameSite: "lax",
        domain: isProduction ? SESSION_DOMAIN : "localhost",
        secure: isProduction,
        expires: new Date(session.expires_at),
        path: "/",
      })

      const data = Boolean(session)
      
      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })