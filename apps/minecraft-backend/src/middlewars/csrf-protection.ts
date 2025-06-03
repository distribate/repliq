import { csrf } from "hono/csrf";
import { createMiddleware } from "hono/factory";

export const csrfProtectionMiddleware = () => createMiddleware(csrf({
  origin: (origin) => /^(https:\/\/(\w+\.)?fasberry\.su|http:\/\/localhost:3000|http:\/\/localhost:3008|http:\/\/localhost:3009)$/.test(origin),
}))
