import { Hono } from 'hono';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';
import type { DB } from '#types/db/forum-database-types.ts';
import type { Insertable } from 'kysely';
import bcrypt from 'bcryptjs';
import { findPlayer } from '#lib/queries/find-player-auth.ts';
import { generateSessionToken } from '#utils/generate-session-token.ts';
import { createSession } from '#utils/create-session.ts';
import { insertSessionInfo } from '#lib/queries/insert-session-info.ts';
import { forumDB } from '#db/db.ts';
import { zValidator } from '@hono/zod-validator';

export type Session = Insertable<Pick<DB, 'users_session'>['users_session']>

export type SessionValidationResult =
  | { session: Session }
  | { session: null };

export const createSessionBodySchema = z.object({
  details: z.object({
    nickname: z.string(),
    userId: z.string().min(10),
    password: z.string().min(4),
  }),
  info: z.object({
    browser: z.string().nullable(),
    cpu: z.string().nullable(),
    ip: z.string().nullable(),
    isBot: z.boolean().nullable(),
    os: z.string().nullable(),
    ua: z.string().nullable(),
  })
});

export const app = new Hono().post(
  '/create-session',
  zValidator('json', createSessionBodySchema, async(result, c) => {
    console.log(result.data)
    if (!result.success) {
      return c.text('Invalid body', 400);
    }
    
    const { details: authDetails, info } = result.data;
    const { userId, password, nickname } = authDetails;
    
    const user = await findPlayer({
      criteria: {
        NICKNAME: nickname,
      },
      extractedFields: [ 'HASH' ],
    });
    
    if (!user) {
      throw new HTTPException(400, { message: 'User not found' });
    }
    
    const isPasswordValid = bcrypt.compareSync(password, user.HASH);
    
    if (!isPasswordValid) {
      throw new HTTPException(400, { message: 'Invalid password' });
    }
    
    const token = generateSessionToken();
    
    try {
      await forumDB.transaction().execute(async(trx) => {
        const session = await createSession({
          trx,
          details: { token, userId },
        });
        
        return await insertSessionInfo({
          trx,
          details: { id: session.id, ...info },
        });
      });
    } catch {
      throw new HTTPException(400, { message: 'Internal Server Error' });
    }
    
    return c.json({ token }, 200);
  }),
);