import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_GET_BALANCE_SUBJECT } from "@repo/shared/constants/nats-subjects";
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

      const req = await nc.request(USER_GET_BALANCE_SUBJECT, nickname)

      const balance: UserBalance = JSON.parse(
        new TextDecoder().decode(req.data)
      )

      return ctx.json({ data: balance }, 200)
    } catch (e) {
      return ctx.json({ data: { charism: 0, belkoin: 0 } }, 200)
    }
  })