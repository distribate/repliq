import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { forumDB } from "../shared/database/forum-db";
import { zValidator } from "@hono/zod-validator";
import { createSessionBodySchema } from "@repo/types/schemas/auth/create-session-schema";
import type { Insertable } from "kysely";
import type { Selectable } from "kysely";
import type { DB, Users } from "@repo/types/db/forum-database-types.ts";
import { findPlayer } from "../lib/queries/find-player-auth.ts";
import bcrypt from "bcryptjs";
import { generateSessionToken } from "../utils/generate-session-token.ts";
import { createSessionTransaction } from "../lib/transactions/create-session-transaction.ts";
import { setCookie } from "hono/cookie";
import { putSessionToken } from "../utils/put-session-token.ts";

export type Session = Insertable<Pick<DB, "users_session">["users_session"]>;
export type User = Selectable<Pick<Users, "id" | "nickname" | "uuid">>;

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export async function checkUserExists(nickname: string) {
  const query = await forumDB
    .selectFrom("users")
    .select(forumDB.fn.countAll().as("count"))
    .where("nickname", "=", nickname)
    .$castTo<{ count: number }>()
    .executeTakeFirstOrThrow();

  if (!query) {
    return false;
  }

  return query.count > 0 ? true : false
}

export const loginRoute = new Hono()
  .post("/login", zValidator("json", createSessionBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const { info, details: { nickname, password } } = createSessionBodySchema.parse(body)

    const isExistsOnForum = await checkUserExists(nickname)

    if (!isExistsOnForum) {
      return ctx.json({ error: "User not found on the forum" }, 404)
    }

    const user = await findPlayer({
      criteria: {
        NICKNAME: nickname,
      },
      extractedFields: ["HASH"],
    });

    if (!user) {
      return ctx.json({ error: "User not found on the server" }, 404);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.HASH);

    if (!isPasswordValid) {
      return ctx.json({ error: "Invalid password" }, 401);
    }

    const token = generateSessionToken();

    try {
      const createdSession = await createSessionTransaction({ token, nickname, info })

      await putSessionToken(nickname, token)

      setCookie(ctx, `session`, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(createdSession.expires_at),
        path: "/",
      })

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })