import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { authClient } from "@repo/shared/api/auth-client";

export const USER_ACTIVE_SESSIONS_QUERY_KEY = createQueryKey("user", ["active-sessions"])

const RESTRICTED_IP = ["127.0.0.1", "localhost", "0.0.0.0"];

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

export type UserActiveSessionsQuery = {
  browser: string | null;
  os: string | null;
  ip: string | null;
  geo: GeoType | null;
  session_id: string,
  is_current: boolean | null;
};

const getUserSessions = async () => {
  const res = await authClient["get-sessions"].$get()
  const data = await res.json()

  if (!data || 'error' in data) {
    return null;
  }

  return data.data
}

export const userActiveSessionsQuery = () => useQuery({
  queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY,
  queryFn: async () => {
    const sessions = await getUserSessions()

    if (!sessions) return null;

    return await Promise.all(
      sessions.map(async (session) => {
        let geo: GeoType | null;

        if (session.ip) {
          if (RESTRICTED_IP.includes(session.ip)) {
            geo = null;
          } else {
            const geoData = await fetch(
              `http://ip-api.com/json/${session.ip}`,
            );
            geo = await geoData.json();
          }
        } else {
          geo = null;
        }

        return { geo, ...session };
      }),
    );
  },
});