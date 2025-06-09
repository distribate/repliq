import dayjs from '@repo/lib/constants/dayjs-instance';
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import { setCookie } from "hono/cookie";
import bcrypt from 'bcryptjs';
import { getClientIp } from "../utils/gen-client-ip.ts";
import type { Context } from "hono";
import type { Session } from "../types/session-type";
import type { User } from "../types/session-type.ts"
import { isProduction } from "@repo/lib/helpers/is-production.ts";
import { SESSION_DOMAIN, SESSION_KEY } from "../shared/constants/session-details.ts";
import { validateAuthenticationRequest } from "../lib/validators/validate-authentication-request.ts";
import { logger } from "@repo/lib/utils/logger.ts";
import { validateExistsUser } from "../lib/validators/validate-exists-user.ts";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { UAParser } from "ua-parser-js"

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
  setCookie(ctx, SESSION_KEY, token, {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
    expires,
    path: "/",
    domain: isProduction ? SESSION_DOMAIN : undefined
  })

  setCookie(ctx, `user`, nickname, {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
    expires,
    path: "/",
    domain: isProduction ? SESSION_DOMAIN : undefined
  })
}

function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export const loginRoute = new Hono()
  .post("/login", zValidator("json", createSessionBodySchema), async (ctx) => {
    const { nickname, password, token: cfToken } = createSessionBodySchema.parse(await ctx.req.json())

    const { 
      browser: { name: browserName }, 
      os: { name: osName }, 
      cpu: { architecture: cpuArch }, 
      device: { model: deviceModel },
      ua 
    } = UAParser(ctx.req.header("User-Agent"))

    await validateAuthenticationRequest({ ctx, token: cfToken })

    const existsUser = await validateExistsUser({ nickname, withCredentials: true })

    const user = existsUser.data

    if (!existsUser.result || !user) {
      return ctx.json({ error: "Not found" }, 404);
    }

    if (user.account_status === 'deleted') {
      return ctx.json({ error: "User deleted" }, 401);
    }

    const isValid = bcrypt.compareSync(password, user.hash)

    if (!isValid) {
      return ctx.json({ error: "Invalid password" }, 401);
    }

    const token = generateSessionToken();
    const ip = getClientIp(ctx)

    if (!ip) {
      return ctx.json({ error: "Invalid ip" }, 401);
    }

    try {
      const createdSession = await createSessionTransaction({
        token, nickname, 
        browser: browserName || "Unknown",
        cpu: cpuArch || "Unknown",
        device: deviceModel || "Unknown", 
        os: osName || "Unknown", 
        ua, 
        ip
      })

      const expires = new Date(createdSession.expires_at)

      logger.info(`${nickname} logged. Ip: ${ip} Time: ${dayjs().format("DD-MM-YYYY HH:mm:ss")}`)

      setSessionCookies({ ctx, expires, nickname, token })

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })