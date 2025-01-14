import { AuthAppType } from "auth-backend/src";
import { hc } from "hono/client";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

const isProduction = process.env.NODE_ENV === "production";

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