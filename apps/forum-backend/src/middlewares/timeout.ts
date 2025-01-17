import type { Context } from "hono"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { timeout } from "hono/timeout"

const customTimeoutException = (ctx: Context) =>
  new HTTPException(408, {
    message: `Request timeout after waiting ${ctx.req.header(
      'Duration'
    )} seconds. Please try again later.`,
  })

export const timeoutMiddleware = createMiddleware(timeout(5000, customTimeoutException))