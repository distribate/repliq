import type { AuthAppType } from "auth-backend/src/types/routes-types.ts";
import { hc } from "hono/client";
import { fetchOptions } from './init.ts';

const authBaseUrl = import.meta.env.PUBLIC_ENV__AUTH_API_PREFIX_URL

if (!authBaseUrl) {
  throw new Error(`authBaseUrl is not defined`)
}

export const authClient = hc<AuthAppType>(authBaseUrl, fetchOptions)