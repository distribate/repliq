import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";

export function exceptionHandler(err: Error | HTTPException, ctx: Context) {
  if (err instanceof HTTPException) {
    return ctx.json({ error: err.message }, err.status);
  }

  return ctx.json({ error: "Internal Server Error" }, 500);
}