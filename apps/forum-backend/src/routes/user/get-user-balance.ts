import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Hono } from "hono";

type UserBalance = {
  charism: number,
  belkoin: number
}

export const getUserBalanceRoute = new Hono()
  .get("/get-user-balance/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const nc = getNatsConnection()

      const req = await nc.request("get-user-balance", nickname)

      const balance: UserBalance = JSON.parse(
        new TextDecoder().decode(req.data)
      )

      return ctx.json({ data: balance }, 200)
    } catch (e) {
      return ctx.json({ data: { charism: 0, belkoin: 0 } }, 200)
    }
  })