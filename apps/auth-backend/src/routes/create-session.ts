import { z } from "zod";
import type { Insertable, Selectable } from "kysely";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { findPlayer as findPlayerAuth } from "#lib/queries/find-player-auth.ts";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcryptjs";
import { generateSessionToken } from "#utils/generate-session-token.ts";
import { forumDB } from "#shared/db.ts";
import { insertSessionInfo } from "#lib/queries/insert-session-info.ts";
import { createSession } from "#utils/create-session.ts";
import type { DB, Users } from "@repo/types/db/forum-database-types.ts";

export type Session = Insertable<Pick<DB, "users_session">["users_session"]>;
export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>;

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

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
  }),
});

export const createSessionRoute = new Hono().post(
  "/create-session",
  zValidator("json", createSessionBodySchema),
  async (c) => {
    const result = createSessionBodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: "Invalid body" }, 400);
    }

    const { details: authDetails, info } = result.data;
    const { userId, password, nickname } = authDetails;

    const user = await findPlayerAuth({
      criteria: {
        NICKNAME: nickname,
      },
      extractedFields: ["HASH"],
    });

    if (!user) {
      throw new HTTPException(400, { message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.HASH);

    if (!isPasswordValid) {
      throw new HTTPException(400, { message: "Invalid password" });
    }

    const token = generateSessionToken();

    try {
      const createdSession = await forumDB
        .transaction()
        .execute(async (trx) => {
          const session = await createSession({
            trx,
            details: { token, userId },
          });

          await insertSessionInfo({
            trx,
            details: { session_id: session.session_id, ...info },
          });

          return session;
        });

      return c.json({ token, expiresAt: createdSession.expires_at }, 200);
    } catch {
      throw new HTTPException(500, { message: "Internal Server Error" });
    }
  },
);
