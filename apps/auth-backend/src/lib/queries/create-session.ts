import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { Transaction } from "kysely";
import type { DB } from "@repo/types/db/forum-database-types.ts";
import type { Session } from "../../types/session-type.ts";
import { DEFAULT_SESSION_EXPIRE } from "../../shared/constants/session-expire";
import { getIpLocation } from "./get-ip-location.ts";

type CreateSession = {
  token: string;
  nickname: string;
  browser: string;
  cpu: string;
  ip: string;
  os: string;
  ua: string;
  device: string;
  trx: Transaction<DB>;
};

export async function createSession({
  trx, browser, cpu, device, ip, nickname, os, token, ua
}: CreateSession) {
  const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  let city: string = "Unknown";
  let country: string = "Unknown";

  const location = await getIpLocation(ip)

  if (location) {
    city = location.city.names["en"]
    country = location.country.names["en"]
  }

  const expires_at = new Date(Date.now() + DEFAULT_SESSION_EXPIRE);

  const session: Session = {
    browser, ip, cpu, device, os, ua, session_id, nickname, token, expires_at,
    location: `${city}, ${country}`,
  };

  const query = await trx
    .insertInto("users_session")
    .values(session)
    .returning(["nickname", "session_id", "expires_at", "browser", "ip"])
    .executeTakeFirstOrThrow();

  return query;
}