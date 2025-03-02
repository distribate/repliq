import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { authClient } from "@repo/shared/api/auth-client";

export const USER_ACTIVE_SESSIONS_QUERY_KEY = createQueryKey("user", ["active-sessions"])

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
  location: string;
  session_id: string,
  is_current: boolean | null;
  created_at: string
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
  queryFn: () => getUserSessions(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});