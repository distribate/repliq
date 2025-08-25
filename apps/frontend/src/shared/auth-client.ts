import type { AuthAppType } from "auth-backend/src/types/routes-types.ts";
import { hc } from "hono/client";
import { fetchOptions } from './init.ts';
import { authBaseUrl } from "./api/init.ts";

export const authClient = hc<AuthAppType>(authBaseUrl!, fetchOptions)