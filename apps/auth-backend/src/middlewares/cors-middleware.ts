import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { corsOptions } from "@repo/shared/constants/cors-options.ts";

export const corsMiddleware = createMiddleware(cors(corsOptions));