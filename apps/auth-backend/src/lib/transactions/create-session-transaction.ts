import { publishLoginNotify } from "../../publishers/pub-login-notify";
import { forumDB } from "../../shared/database/forum-db";
import { putSessionToken } from "../../utils/put-session-token";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { Transaction } from "kysely";
import type { DB } from "@repo/types/db/forum-database-types.ts";
import type { Session } from "../../types/session-type.ts";
import { DEFAULT_SESSION_EXPIRE } from "../../shared/constants/session-expire";
import { getIpLocation } from "../queries/get-ip-location.ts";

type CreateSessionTransaction = {
  nickname: string,
  token: string,
} & {
  ip: string;
  ua: string;
  browser: string;
  cpu: string;
  device: string;
  os: string;
}

type NotifyAboutLogin = Pick<CreateSessionTransaction, "nickname" | "browser" | "ip">

async function notifyAboutLogin({ browser, ip, nickname }: NotifyAboutLogin) {
  const check = await forumDB
    .selectFrom("users_session")
    .select(forumDB.fn.countAll().as("count"))
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (check && Number(check.count) > 1) {
    publishLoginNotify({ browser, ip, nickname })
  }
}

type CreateSession = CreateSessionTransaction & {
  trx: Transaction<DB>;
};

async function createSession({
  trx, browser, cpu, device, ip, nickname, os, token, ua
}: CreateSession) {
  const session_id = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

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

export const createSessionTransaction = async ({
  token, nickname, browser, cpu, ip, os, ua, device
}: CreateSessionTransaction) => {
  const query = await forumDB.transaction().execute(async (trx) => {
    const session = await createSession({
      trx, token, nickname, browser, cpu, ip, os, ua, device
    });

    await putSessionToken(nickname, token)

    return session;
  });

  notifyAboutLogin({ browser, ip, nickname })

  return query;
}