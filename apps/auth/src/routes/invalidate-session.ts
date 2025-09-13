import { Hono } from "hono";
import { throwError } from '#utils/throw-error.ts';
import { setCookie } from "hono/cookie";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details";
import { destroySession, getSession, getSessionToken, type Session } from "../utils/auth";
import { isProduction } from "#shared/env/index.ts";

export const invalidateSessionRoute = new Hono()
  .post("/invalidate-session", async (ctx) => {
    const token = getSessionToken(ctx)

    if (!token) {
      return ctx.json({ error: "Session token not found" }, 401)
    }

    let sessionDetails: Pick<Session, "nickname" | "ip"> | null = null;

    try {
      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
      );

      sessionDetails = await getSession(sessionId);

      await destroySession(token);

      if (sessionDetails) {
        sessionDetails = null;
      }

      setCookie(ctx, SESSION_KEY, "", {
        httpOnly: true,
        sameSite: "None",
        secure: isProduction,
        domain: isProduction ? SESSION_DOMAIN : "localhost",
        maxAge: 0,
        path: "/",
      })

      return ctx.json({ data: { status: "Success" } }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });