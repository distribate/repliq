import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { validateSessionToken } from "../utils/validate-session-token";
import type { Env } from "../types/env-type";
import { getNicknameByTokenFromKv } from "../utils/get-nickname-by-token-from-kv";
import { isProduction } from "@repo/lib/helpers/is-production";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details";
import { validateUserRequest } from "../middlewares/validate-user-request";

export const validateSessionRoute = new Hono<Env>()
  .use(validateUserRequest({ withValidation: false }))
  .get("/validate-session", async (ctx) => {
    const token = ctx.get("sessionToken")

    if (!token) {
      return ctx.json({ data: false }, 200)
    }

    try {
      const nickname = await getNicknameByTokenFromKv(token);

      if (!nickname) {
        const session = await validateSessionToken(token);

        if (!session) {
          return ctx.json({ error: "Invalid session token" }, 401)
        }

        setCookie(ctx, SESSION_KEY, token, {
          httpOnly: true,
          sameSite: "lax",
          domain: isProduction ? SESSION_DOMAIN : "localhost",
          secure: isProduction,
          expires: new Date(session.expires_at),
          path: "/",
        })
      }

      return ctx.json({ data: true }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })