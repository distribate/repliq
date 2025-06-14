import { encodeHexLowerCase } from "@oslojs/encoding";
import { HTTPException } from "hono/http-exception";
import { sha256 } from "@oslojs/crypto/sha2";
import { updateSessionExpires } from "../lib/queries/update-session.ts";
import { deleteSession } from "../lib/queries/delete-session.ts";
import type { Session } from "../types/session-type.ts";
import { MIN_SESSION_EXPIRE } from "../shared/constants/session-expire.ts";
import { putSessionToken } from "./put-session-token.ts";
import { deleteSessionToken } from "./delete-session-token.ts";
import { forumDB } from "../shared/database/forum-db.ts";

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

export async function validateSessionToken(
  token: string,
): Promise<Pick<SessionResult, "session_id" | "nickname" | "expires_at"> | null> {
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const res = await getSession(sessionId)
  if (!res) return null

  const { session_id, expires_at, nickname } = res;

  const session: Pick<SessionResult, "session_id" | "nickname" | "expires_at"> = {
    session_id, nickname, expires_at
  };

  const expiresAt = new Date(session.expires_at);

  if (Date.now() >= expiresAt.getTime()) {
    const [res, _] = await Promise.all([
      deleteSession(session_id), deleteSessionToken(token)
    ]);

    if (!res) {
      throw new HTTPException(401, { message: "Internal Server Error" });
    }

    return null;
  }

  if (Date.now() >= expiresAt.getTime() - MIN_SESSION_EXPIRE) {
    session.expires_at = new Date(Date.now() + MIN_SESSION_EXPIRE);

    await Promise.all([
      putSessionToken(nickname, token),
      updateSessionExpires({ expires_at: session.expires_at, session_id })
    ]);
  }

  return session
}