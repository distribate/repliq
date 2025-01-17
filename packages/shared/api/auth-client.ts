import { AuthAppType } from "auth-backend/src";
import { hc } from "hono/client";
import { isProduction } from "@repo/lib/helpers/is-production";

const production = `https://cc.fasberry.su/api/auth`;
const development = `http://localhost:4100/api/auth`;

const origin = isProduction ? production : development;

export const authClient = hc<AuthAppType>(
  origin,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      }
      )
    }
  }
)