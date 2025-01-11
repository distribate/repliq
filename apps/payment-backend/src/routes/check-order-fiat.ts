import { Hono } from "hono";

export const checkOrderFiatRoute = new Hono()
  .post("/check-order/fiat", async (ctx) => {
    const body = await ctx.req.json()

    console.log(body)

    return ctx.json(body, 200)
  })