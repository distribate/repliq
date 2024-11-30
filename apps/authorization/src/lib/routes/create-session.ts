import { z } from 'zod';
import type { DB, Users } from '#types/db/forum-database-types.ts';
import type { Insertable, Selectable } from 'kysely';

export type Session = Insertable<Pick<DB, 'users_session'>['users_session']>
export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>

export type SessionValidationResult =
  | { session: Session, user: User }
  | { session: null, user: null };

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