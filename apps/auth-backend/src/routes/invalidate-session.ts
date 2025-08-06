import { Hono } from "hono";
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getCookie, setCookie } from "hono/cookie";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { invalidateSession } from "../lib/queries/invalidate-session";
import type { Context } from "hono";
import { isProduction } from "@repo/lib/helpers/is-production";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details";
import { logger } from "@repo/lib/utils/logger";
import { forumDB } from "../shared/database/forum-db";
import dayjs from '@repo/lib/constants/dayjs-instance';

export function deleteCookiesToken(ctx: Context) {
  setCookie(ctx, SESSION_KEY, "", {
    httpOnly: true,
    sameSite: "None",
    secure: isProduction,
    domain: isProduction ? SESSION_DOMAIN : "localhost",
    maxAge: 0,
    path: "/",
  })
}

async function getSessionDetails(sessionId: string) {
  const user = await forumDB
    .selectFrom("users_session")
    .select(['nickname', "ip"])
    .where("session_id", "=", sessionId)
    .executeTakeFirst()

  if (!user) return null;

  return user;
}

export const invalidateSessionRoute = new Hono()
  .post("/invalidate-session", async (ctx) => {
    const sessionToken = getCookie(ctx, SESSION_KEY)

    if (!sessionToken) {
      return ctx.json({ error: "Session token not found" }, 401)
    }

    let sessionDetails: { nickname: string; ip: string; } | null = null;

    try {
      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(sessionToken))
      );

      sessionDetails = await getSessionDetails(sessionId);

      const result = await invalidateSession({ token: sessionToken, sessionId });

      if (!result) {
        return ctx.json({ error: "Internal Server Error" }, 500)
      }

      if (sessionDetails) {
        logger.info(`${sessionDetails.nickname} unlogged. Ip: ${sessionDetails.ip} Time: ${dayjs().format("DD-MM-YYYY HH:mm:ss")}`)
        sessionDetails = null;
      }

      deleteCookiesToken(ctx)

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });