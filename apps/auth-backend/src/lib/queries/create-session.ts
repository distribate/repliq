import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { Transaction } from "kysely";
import type { DB } from "@repo/types/db/forum-database-types.ts";
import type { Session } from "../../types/session-type.ts";
import { DEFAULT_SESSION_EXPIRE } from "../../shared/constants/session-expire";
import ky from "ky";

type CreateSession = {
  details: {
    token: string;
    nickname: string;
  };
  info: {
    browser: string | null;
    cpu: string | null;
    ip: string;
    isBot: boolean | null;
    os: string | null;
    ua: string | null;
    device: string | null;
  },
  trx: Transaction<DB>;
};

type GeoType = {
  query: string;
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
};

const url = "http://ip-api.com/json"

async function getLocation(ip: string) {
  return await ky.get(`${url}/${ip}`).json<GeoType>();
}

export async function createSession({
  details, trx, info
}: CreateSession) {
  const { token, nickname } = details;

  const session_id = encodeHexLowerCase(sha256(
    new TextEncoder().encode(token))
  );

  let city: string = "Unknown";
  let country: string = "Unknown";

  try {
    const location = await getLocation(info.ip);
    
    if (location.city) {
      city = location.city;
    }

    if (location.country) {
      country = location.country;
    }
  } catch (e) {
    console.error(e)
  }

  const session: Session = {
    ...info,
    location: `${city}, ${country}`,
    session_id,
    nickname,
    token,
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