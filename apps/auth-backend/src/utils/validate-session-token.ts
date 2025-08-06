import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { deleteSession } from "../lib/queries/delete-session.ts";
import type { Session } from "../types/session-type.ts";
import { MIN_SESSION_EXPIRE } from "../shared/constants/session-expire.ts";
import { putSessionToken } from "./put-session-token.ts";
import { deleteSessionToken } from "./delete-session-token.ts";
import { forumDB } from "../shared/database/forum-db.ts";
import { logger } from "@repo/lib/utils/logger.ts";

type SessionResult = Omit<Session, "token" | "ip">

const getSession = async (session_id: string) => {
  return forumDB
    .selectFrom("users_session")
    .innerJoin("users", "users.nickname", "users_session.nickname")
    .select([
      "users_session.session_id",
      "users_session.expires_at",
      "users_session.nickname"
    ])
    .where("users_session.session_id", "=", session_id)
    .executeTakeFirst();
}

type UpdateSessionExpire = {
  expires_at: Date,
  session_id: string
}

const updateSessionExpires = async ({ expires_at, session_id }: UpdateSessionExpire) => {
  return forumDB
    .updateTable("users_session")
    .set({ expires_at: expires_at })
    .where("session_id", "=", session_id)
    .execute();
}

type ValidatePayload = Pick<SessionResult, "session_id" | "nickname" | "expires_at">

export async function validateSessionToken(token: string): Promise<ValidatePayload | null> {
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const res = await getSession(sessionId);

  if (!res) {
    throw new Error("Session is not defined")
  }

  const { session_id, expires_at, nickname } = res;

  const session: Pick<SessionResult, "session_id" | "nickname" | "expires_at"> = {
    session_id, nickname, expires_at
  };

  const expiresAt = new Date(session.expires_at);

  const isExpired = Date.now() >= expiresAt.getTime()

  try {
    if (isExpired) {
      const [res, _] = await Promise.all([
        deleteSession(session_id), deleteSessionToken(token)
      ]);

      if (!res) {
        throw new Error("Internal Server Error")
      }

      return null;
    }

    if (Date.now() >= (expiresAt.getTime() - MIN_SESSION_EXPIRE)) {
      session.expires_at = new Date(Date.now() + MIN_SESSION_EXPIRE);

      await Promise.all([
        putSessionToken(nickname, token),
        updateSessionExpires({ expires_at: session.expires_at, session_id })
      ]);
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e)
    }

    throw e
  }

  return session
}