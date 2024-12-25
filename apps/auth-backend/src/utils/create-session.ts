import { encodeHexLowerCase } from "@oslojs/encoding";
import type { Session } from "#routes/create-session.ts";
import { sha256 } from "@oslojs/crypto/sha2";
import { Transaction } from "kysely";
import type { DB } from "@repo/types/db/forum-database-types.ts";

type CreateSession = {
  details: {
    token: string;
    userId: string;
  };
  trx: Transaction<DB>;
};

export async function createSession({
  details,
  trx,
}: CreateSession): Promise<Session> {
  const { token, userId } = details;

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: Session = {
    session_id: sessionId,
    user_id: userId,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  return await trx
    .insertInto("users_session")
    .values(session)
    .returning(["user_id", "session_id", "expires_at"])
    .executeTakeFirstOrThrow();
}
