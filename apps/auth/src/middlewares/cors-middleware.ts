import { cors as corsMiddleware } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { corsOptions } from "@repo/shared/constants/cors-options.ts";

export const cors = () => createMiddleware(
  corsMiddleware(corsOptions)
);