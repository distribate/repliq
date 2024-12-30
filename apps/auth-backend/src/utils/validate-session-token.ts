import type {
  Session,
  SessionValidationResult,
  User,
} from "../routes/create-session.ts";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { HTTPException } from "hono/http-exception";
import { sha256 } from "@oslojs/crypto/sha2";
import { updateSessionExpires } from "../lib/queries/update-session.ts";
import { deleteSession } from "../lib/queries/delete-session.ts";
import { getSession } from "../lib/queries/get-session.ts";

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const row = await getSession(sessionId)

  if (!row) {
    return { session: null, user: null };
  }

  const { session_id, user_id, expires_at, nickname, uuid, userId } = row;

  const session: Session = { session_id, user_id, expires_at };
  const user: User = { nickname, uuid, id: userId };
  const expiresAt = new Date(session.expires_at);

  if (Date.now() >= expiresAt.getTime()) {
    const res = await deleteSession(session_id)

    if (!res) {
      throw new HTTPException(401, { message: "Internal Server Error" });
    }

    return { session: null, user: null };
  }

  if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await updateSessionExpires({ expires_at, session_id })
  }

  return { session, user };
}