import type {
  Session,
  SessionValidationResult,
  User,
} from "../routes/create-session.ts";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { forumDB } from "../shared/db.ts";
import { HTTPException } from "hono/http-exception";
import { sha256 } from "@oslojs/crypto/sha2";

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const row = await forumDB
    .selectFrom("users_session")
    .innerJoin("users", "users.id", "users_session.user_id")
    .select([
      "users_session.session_id",
      "users_session.user_id",
      "users_session.expires_at",
      "users.id as userId",
      "users.nickname as nickname",
      "users.uuid as uuid",
    ])
    .where("users_session.session_id", "=", sessionId)
    .executeTakeFirst();

  if (!row) {
    return { session: null, user: null };
  }

  const { session_id, user_id, expires_at, nickname, uuid, userId } = row;

  const session: Session = { session_id, user_id, expires_at };
  const user: User = { nickname, uuid, id: userId };
  const expiresAt = new Date(session.expires_at);

  if (Date.now() >= expiresAt.getTime()) {
    const res = await forumDB
      .deleteFrom("users_session")
      .where("session_id", "=", session_id)
      .executeTakeFirstOrThrow();

    if (!res) {
      throw new HTTPException(401, { message: "Internal Server Error" });
    }

    return { session: null, user: null };
  }

  if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await forumDB
      .updateTable("users_session")
      .set({ expires_at: session.expires_at })
      .where("session_id", "=", session.session_id)
      .execute();
  }

  return { session, user };
}
