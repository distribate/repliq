import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { checkUserExists } from './login.ts';
import ky, { HTTPError } from 'ky';
import { validatePasswordSafe } from '../utils/validate-password-safe.ts';
import { generateOfflineUUID } from '../utils/generate-offline-uuid.ts';
import { validateIpRestricts } from '../utils/validate-ip-restricts.ts';
import { getClientIp } from '../utils/gen-client-ip.ts';

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
    referrer: z.string().optional()
  })
});

export const registerRoute = new Hono()
  .post('/register', zValidator('json', createUserBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const details = createUserBodySchema.parse(body);
    const { password, details: { findout, realName: real_name, referrer }, nickname } = details;

    const IP = getClientIp(ctx) ?? "1.1.1.1"

    const isValid = await validateIpRestricts(IP)

    if (isValid) {
      return ctx.json({ error: "IP already exists" }, 400)
    }

    const isExistsOnForum = await checkUserExists(nickname)

    if (isExistsOnForum) {
      return ctx.json({ error: "User already exists" }, 400)
    }

    const isPasswordSafe = validatePasswordSafe(password)

    if (!isPasswordSafe) {
      return ctx.json({ error: 'Unsafe password' }, 401);
    }

    const HASH = Bun.password.hashSync(password, {
      algorithm: "bcrypt",
      cost: 10
    })

    let user: PremiumUser | null;

    try {
      user = await ky
        .get(`https://api.ashcon.app/mojang/v2/user/${nickname}`)
        .json<PremiumUser>();
    } catch (e) {
      if (e instanceof HTTPError) {
        const error = await e.response.json<MojangError>();

        if (error.reason.includes("User not found")) {
          return ctx.json({ error: "Nickname invalid" }, 400);
        }

        user = null
      }
      user = null
    }

    const offlineUUID = generateOfflineUUID(nickname);

    user = {
      uuid: offlineUUID,
      username: nickname
    }

    console.log(details)

    try {
      const registered = await createUserTransaction({
        nickname, findout, real_name, HASH, IP, referrer,
        UUID: user.uuid,
        LOWERCASENICKNAME: nickname.toLowerCase(),
        NICKNAME: nickname,
        REGDATE: new Date().getTime()
      })

      if (!registered || !registered.user_nickname) {
        return ctx.json({ error: 'Error in creating user' }, 400);
      }

      return ctx.json({ status: "Success" }, 201);
    } catch (e) {
      console.log(e)
      return ctx.json({ error: throwError(e) }, 500);
    }
  });