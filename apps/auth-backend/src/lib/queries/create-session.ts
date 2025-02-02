import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { Transaction } from "kysely";
import type { DB } from "@repo/types/db/forum-database-types.ts";
import type { Session } from "../../types/session-type.ts";
import { DEFAULT_SESSION_EXPIRE } from "../../shared/constants/session-expire";

type CreateSession = {
  details: {
    token: string;
    nickname: string;
  };
  info: {
    browser: string | null;
    cpu: string | null;
    ip: string | null;
    isBot: boolean | null;
    os: string | null;
    ua: string | null;
    device: string | null;
  },
  trx: Transaction<DB>;
};

export async function createSession({
  details, trx, info
}: CreateSession) {
  const { token, nickname } = details;

  const session_id = encodeHexLowerCase(sha256(
    new TextEncoder().encode(token))
  );

  const session: Session = {
    ...info, session_id, nickname, token,
    expires_at: new Date(Date.now() + DEFAULT_SESSION_EXPIRE),
  };

  return await trx
    .insertInto("users_session")
    .values(session)
    .returning([
      "nickname", "session_id", "expires_at", "browser", "ip"
    ])
    .executeTakeFirstOrThrow();
}