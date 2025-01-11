import type { Insertable, Selectable } from "kysely";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { findPlayer } from "../lib/queries/find-player-auth.ts";
import { generateSessionToken } from "../utils/generate-session-token.ts";
import type { DB, Users } from "@repo/types/db/forum-database-types.ts";
import { createSessionBodySchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import bcrypt from "bcryptjs";
import { throwError } from '@repo/lib/helpers/throw-error.ts';

export type Session = Insertable<Pick<DB, "users_session">["users_session"]>;
export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>;

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export const createSessionRoute = new Hono()
  .post("/create-session", zValidator("json", createSessionBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = createSessionBodySchema.parse(body);

    const { details: authDetails, info } = result;
    const { password, nickname } = authDetails;

    const user = await findPlayer({
      criteria: {
        NICKNAME: nickname,
      },
      extractedFields: ["HASH"],
    });

    if (!user) {
      return ctx.json({ error: "User not found" }, 404);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.HASH);

    if (!isPasswordValid) {
      return ctx.json({ error: "Invalid password" }, 401);
    }

    const token = generateSessionToken();

    try {
      const createdSession = await createSessionTransaction({ token, nickname, info })

      return ctx.json({
        data: {
          token,
          expiresAt: createdSession.expires_at
        }
      }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });