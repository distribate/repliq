import { Hono } from "hono"

export const getHealthRoute = new Hono().get("/health", async (ctx) => ctx.body(null, 200))