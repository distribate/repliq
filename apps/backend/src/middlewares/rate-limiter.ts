import { createMiddleware } from "hono/factory";
import { rateLimiter as limiter } from "hono-rate-limiter";
import { isProduction } from "#helpers/is-production.ts";

const REQUESTS_PER_MINUTE = isProduction ? 400 : 5000;

export const rateLimiterMiddleware = () => createMiddleware(limiter({
  windowMs: 60000,
  limit: REQUESTS_PER_MINUTE,
  standardHeaders: "draft-6",
  keyGenerator: (ctx) => ctx.req.header("x-forwarded-for") ?? "",
  handler: (ctx) => {
    return ctx.json({ error: "Too many requests, please wait a minute before trying again." }, 429)
  }
}))