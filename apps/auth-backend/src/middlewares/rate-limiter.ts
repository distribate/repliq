import { createMiddleware } from "hono/factory";
import { rateLimiter as limiter } from "hono-rate-limiter";

const REQUESTS_PER_MINUTE = 100

export const rateLimiterMiddleware = createMiddleware(limiter({
  windowMs: 60000,
  limit: REQUESTS_PER_MINUTE,
  standardHeaders: "draft-6",
  keyGenerator: (ctx) => ctx.req.header("x-forwarded-for") ?? "",
}))