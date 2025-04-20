import type { AuthAppType } from "auth-backend/src/types/routes-types.ts";
import { hc } from "hono/client";
import { isProduction } from "@repo/lib/helpers/is-production.ts";
import { fetchOptions } from "../constants/fetch-options.ts";

const baseUrl = isProduction ? `https://api.fasberry.su/auth` : `http://localhost:4100/auth`;

export const authClient = hc<AuthAppType>(baseUrl, fetchOptions)