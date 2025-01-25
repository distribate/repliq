import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { checkUserExists } from './login.ts';
import ky, { HTTPError } from 'ky';
import { getConnInfo } from "hono/bun"
import { validatePasswordSafe } from '../utils/validate-password-safe.ts';
import { convertIPv6ToIPv4 } from '../helpers/ipv6-to-ipv4.ts';

type PremiumUser = {
  uuid: string,
  username: string
}

type MojangError = {
  code: number,
  error: string,
  reason: string
}

export const createUserBodySchema = z.object({
  nickname: z.string().min(1),
  password: z.string().min(4),
  details: z.object({
    realName: z.string().or(z.null()),
    findout: z.string(),
  })
});

export const registerRoute = new Hono()
  .post('/register', zValidator('json', createUserBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const details = createUserBodySchema.parse(body);
    const { password, details: { findout, realName }, nickname } = details;

    let available = false;

    if (!available) {
      return ctx.json({ status: "Not available" }, 201);
    }

    const isExistsOnForum = await checkUserExists(nickname)

    if (isExistsOnForum) {
      return ctx.json({ error: "User already exists" }, 400)
    }

    console.log(getConnInfo(ctx))
    console.log(ctx.req.header("x-forwarded-for"))

    const isPasswordSafe = validatePasswordSafe(password)

    if (!isPasswordSafe) {
      return ctx.json({ error: 'Unsafe password' }, 401);
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const xForwardedFor = ctx.req.header("x-forwarded-for") ?? getConnInfo(ctx).remote.address;
    const clientIp = xForwardedFor?.split(",")[0]

    if (!clientIp) {
      return ctx.json({ error: "Unknown client IP" }, 400);
    }

    let user: PremiumUser | null;

    try {
      user = await ky.get(`https://api.ashcon.app/mojang/v2/user/${nickname}`).json<PremiumUser>();
    } catch (e) {
      if (e instanceof HTTPError) {
        const error = await e.response.json<MojangError>();

        if (error.reason.includes("User not found")) {
          return ctx.json({ error: "Nickname invalid" }, 400);
        }

        return ctx.json({ error: error.reason }, 400);
      }

      return ctx.json({ error: 'Unknown error' }, 400);
    }

    try {
      const registered = await createUserTransaction({
        nickname, findout, real_name: realName ?? null,
        UUID: user.uuid,
        HASH: passwordHash,
        LOWERCASENICKNAME: nickname.toLowerCase(),
        NICKNAME: nickname,
        IP: convertIPv6ToIPv4(clientIp),
        REGDATE: new Date().getTime(),
      })

      if (!registered || !registered.user_nickname) {
        return ctx.json({ error: 'Error in creating user' }, 400);
      }

      return ctx.json({ status: "Success" }, 201);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });