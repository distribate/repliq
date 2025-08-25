import { timeout } from "hono/timeout";
import { createMiddleware } from "hono/factory";

export const timeoutMiddleware = () => createMiddleware(timeout(10000));