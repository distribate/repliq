import type { AuthAppType } from "auth/src/types/routes-types.ts";
import { hc } from "hono/client";
import { fetchOptions } from './init.ts';
import { AUTH_BASE_URL } from "./env/index.ts";

export const authClient = hc<AuthAppType>(AUTH_BASE_URL, fetchOptions)