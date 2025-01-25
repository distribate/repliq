import { createMiddleware } from "hono/factory";
import { rateLimiter as limiter } from "hono-rate-limiter";

export const rateLimiterMiddleware = createMiddleware(limiter({
  windowMs: 60000,
  limit: 300,
  standardHeaders: "draft-6",
  keyGenerator: (ctx) => ctx.req.header("x-forwarded-for") ?? "",
}))