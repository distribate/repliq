import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { findPlayer } from '../lib/queries/find-player-auth.ts';
import { createUserTransaction } from '../lib/transactions/create-user-transaction.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { checkUserExists } from './login.ts';

export const createUserBodySchema = z.object({
  nickname: z.string().min(1),
  password: z.string().min(4),
  realName: z.string().or(z.null()),
  findout: z.string().or(z.null()),
});

export const registerRoute = new Hono()
  .post('/register', zValidator('json', createUserBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const details = createUserBodySchema.parse(body);
    const { password, realName, findout, nickname } = details;

    const isExistsOnForum = await checkUserExists(nickname)

    if (isExistsOnForum) {
      return ctx.json({ error: "User already exists on the forum" }, 400)
    }

    const findedUser = await findPlayer({
      criteria: {
        NICKNAME: nickname,
      },
      extractedFields: ['HASH', 'UUID'],
    });

    if (!findedUser || !findedUser.UUID) {
      return ctx.json({ error: 'User not found on the server' }, 404);
    }

    const { HASH: storedPassword, UUID: uuid } = findedUser

    const isPasswordValid = await bcrypt.compare(password, storedPassword);

    if (!isPasswordValid) {
      return ctx.json({ error: 'Invalid password' }, 401);
    }

    try {
      const user = await createUserTransaction({
        nickname, findout, real_name: realName ?? null, uuid
      })

      if (!user || !user.user_nickname) {
        return ctx.json({ error: 'Error in creating user' }, 400);
      }

      return ctx.json({ status: "Success" }, 201);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  });