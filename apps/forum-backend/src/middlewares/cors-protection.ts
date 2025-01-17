import { corsOptions } from "@repo/shared/constants/cors-options.ts";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";

export const corsProtectionMiddleware = createMiddleware(cors(corsOptions))