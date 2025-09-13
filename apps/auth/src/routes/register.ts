import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';
import { throwError } from '#utils/throw-error.ts';
import { validatePasswordSafe } from '../lib/validators/validate-password-safe.ts';
import { registerSchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import { validateAuthenticationRequest } from '../lib/validators/validate-authentication-request.ts';
import { validateExistsUser } from '../lib/validators/validate-exists-user.ts';
import { publishRegisterNotify } from '#publishers/pub-register-notify.ts';

export const registerRoute = new Hono()
  .post('/register', zValidator('json', registerSchema), async (ctx) => {    
    const { password, findout, referrer, nickname, token } = registerSchema.parse(await ctx.req.json());

    await validateAuthenticationRequest({ ctx, token })

    const isExistsOnForum = await validateExistsUser({ nickname })

    if (isExistsOnForum.result) {
      return ctx.json({ error: "User already exists" }, 400)
    }

    const passwordIsSafe = validatePasswordSafe(password)

    if (!passwordIsSafe) {
      return ctx.json({ error: 'Unsafe password' }, 401);
    }

    try {
      const result = await createUserTransaction({ findout, nickname, referrer, password })

      publishRegisterNotify(result.nickname)

      return ctx.json({ status: "Success" }, 201);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });