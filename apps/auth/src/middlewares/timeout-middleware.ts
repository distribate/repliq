import { timeout as timeoutMiddleware } from "hono/timeout";
import { createMiddleware } from "hono/factory";

const TIMEOUT_TIME = 10000

export const timeout = () => createMiddleware(
  timeoutMiddleware(TIMEOUT_TIME)
);