import { encodeHexLowerCase } from "@oslojs/encoding";
import { HTTPException } from "hono/http-exception";
import { sha256 } from "@oslojs/crypto/sha2";
import { updateSessionExpires } from "../lib/queries/update-session.ts";
import { deleteSession } from "../lib/queries/delete-session.ts";
import { getSession } from "../lib/queries/get-session.ts";
import type { User } from "../types/session-type.ts"
import type { Session } from "../types/session-type.ts";
import { MIN_SESSION_EXPIRE } from "../shared/constants/session-expire.ts";
import { putSessionToken } from "./put-session-token.ts";
import { deleteSessionToken } from "./delete-session-token.ts";

export type SessionValidationResult =
  | { session: Omit<Session, "token" | "ip">; user: User }
  | { session: null; user: null };

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const res = await getSession(sessionId)

  if (!res) {
    return { session: null, user: null };
  }

  const { session_id, expires_at, nickname, uuid, userId } = res;

  const session: Omit<Session, "token" | "ip"> = {
    session_id, nickname, expires_at
  };

  const user: User = {
    nickname, uuid, id: userId
  };

  const expiresAt = new Date(session.expires_at);

  if (Date.now() >= expiresAt.getTime()) {
    const [res, _] = await Promise.all([
      deleteSession(session_id),
      deleteSessionToken(token)
    ]);

    if (!res) {
      throw new HTTPException(401, { message: "Internal Server Error" });
    }

    return { session: null, user: null };
  }

  if (Date.now() >= expiresAt.getTime() - MIN_SESSION_EXPIRE) {
    session.expires_at = new Date(Date.now() + MIN_SESSION_EXPIRE);

    await Promise.all([
      putSessionToken(user.nickname, token),
      updateSessionExpires({ expires_at: session.expires_at, session_id })
    ]);
  }

  return { session, user };
}