import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import { findPlayer } from "../lib/queries/find-player-auth.ts";
import { generateSessionToken } from "../utils/generate-session-token.ts";
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import { setCookie } from "hono/cookie";
import bcrypt from 'bcryptjs';
import { getClientIp } from "../utils/gen-client-ip.ts";
import type { Context } from "hono";
import type { Session } from "../types/session-type";
import type { User } from "../types/session-type.ts"
import { verifyAuth } from "../utils/verify-auth.ts";
import { isProduction } from "@repo/lib/helpers/is-production.ts";

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

type SetCookieOpts = {
  token: string,
  ctx: Context,
  expires: Date,
  nickname: string
}

function setSessionCookies({
  ctx, expires, nickname, token
}: SetCookieOpts) {
  setCookie(ctx, `user`, nickname, {
    httpOnly: true, sameSite: "lax", domain: "fasberry.su", secure: isProduction, expires, path: "/",
  })

  setCookie(ctx, `session`, token, {
    httpOnly: true, sameSite: "lax", secure: isProduction, expires, path: "/",
  })
}

export const loginRoute = new Hono()
  .post("/login", zValidator("json", createSessionBodySchema), async (ctx) => {
    const {
      browser, cpu, device, os, ua, nickname, password, token: cloudFlareToken
    } = createSessionBodySchema.parse(await ctx.req.json())

    if (isProduction && !cloudFlareToken) {
      return ctx.json({ error: "Token is not provided" }, 400)
    }

    const isVerified = await verifyAuth(cloudFlareToken!)

    if (isVerified !== "verified") {
      return ctx.json({ error: "Invalid token" }, 400)
    }

    const user = await findPlayer({
      criteria: { NICKNAME: nickname }, extractedFields: ["HASH"],
    });

    if (!user) {
      return ctx.json({ error: "Not found" }, 404);
    }

    const isValid = bcrypt.compareSync(password, user.HASH)

    if (!isValid) {
      return ctx.json({ error: "Invalid password" }, 401);
    }

    const token = generateSessionToken();
    const ip = getClientIp(ctx)

    try {
      const createdSession = await createSessionTransaction({
        token, nickname, browser, cpu, device, os, ua, ip
      })

      const expires = new Date(createdSession.expires_at)

      setSessionCookies({ ctx, expires, nickname, token })

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })