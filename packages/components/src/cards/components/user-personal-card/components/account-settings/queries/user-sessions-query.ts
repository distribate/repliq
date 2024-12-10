import { QueryKey, useQuery } from "@tanstack/react-query";
import {
  UserSessions,
} from "@repo/lib/queries/get-user-sessions.ts";

export const USER_ACTIVE_SESSIONS_QUERY_KEY: QueryKey = [
  "user",
  "active-sessions",
];

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

export type UserActiveSessionsQuery = UserSessions & {
  geo: GeoType | null;
};

export const userActiveSessionsQuery = () =>
  useQuery<UserActiveSessionsQuery[] | null, Error>({
    queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY,
    queryFn: async () => {
      return null;
      // const sessions = await getUserActiveSessions();
      //
      // if (!sessions) return null;
      //
      // return await Promise.all(
      //   sessions.map(async (session) => {
      //     let geo: GeoType | null;
      //
      //     if (session.ip) {
      //       if (RESTRICTED_IP.includes(session.ip)) {
      //         geo = null;
      //       } else {
      //         const geoData = await fetch(
      //           `http://ip-api.com/json/${session.ip}`,
      //         );
      //         geo = await geoData.json();
      //       }
      //     } else {
      //       geo = null;
      //     }
      //
      //     return { geo, ...session };
      //   }),
      // );
    },
    refetchInterval: 10 * 3600,
  });
