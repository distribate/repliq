import type { Insertable, Selectable } from "kysely";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { findPlayer as findPlayerAuth } from "../lib/queries/find-player-auth.ts";
import { HTTPException } from "hono/http-exception";
import { generateSessionToken } from "../utils/generate-session-token.ts";
import type { DB, Users } from "@repo/types/db/forum-database-types.ts";
import { createSessionBodySchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import bcrypt from "bcryptjs";
import { publishAuthNotify } from "../puslishers/pub-auth-notify.ts";

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
    const createdSession = await createSessionTransaction({
      token, userId, info
    })

    await publishAuthNotify({
      session_id: createdSession.session_id.toString(),
      nickname
    })

    return ctx.json({ token, expiresAt: createdSession.expires_at }, 200);
  } catch (e) {
    console.error(e);
    throw new HTTPException(500, { message: "Internal Server Error" });
  }}
);