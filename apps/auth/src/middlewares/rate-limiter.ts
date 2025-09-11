import { createMiddleware } from "hono/factory";
import { rateLimiter as rateLimiterMiddleware } from "hono-rate-limiter";
import { isProduction } from "#shared/env/index.ts";

const REQUESTS_PER_MINUTE = isProduction ? 400 : 5000;

export const rateLimiter = () => createMiddleware(
  rateLimiterMiddleware({
    windowMs: 60000,
    limit: REQUESTS_PER_MINUTE,
    standardHeaders: "draft-6",
    keyGenerator: (ctx) => ctx.req.header("x-forwarded-for") ?? "",
    handler: (ctx) => {
      return ctx.json({ error: "Too many requests, please wait a minute before trying again." }, 429)
    }
  })
)