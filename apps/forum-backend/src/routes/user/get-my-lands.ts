import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { throwError } from "@repo/lib/helpers/throw-error";
import { USER_GET_LANDS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { Hono } from "hono";

export type UserLands = {
  area: any;
  members: {
    uuid: string;
    nickname: string;
  }[];
  ulid: string;
  name: string;
  created_at: Date;
  title: string | null;
  type: string;
}[]

export const getMyLandsRoute = new Hono()
  .get("/get-my-lands", async (ctx) => {
    const nickname = getNickname()

    try {
      const nc = getNatsConnection()

      const req = await nc.request(USER_GET_LANDS_SUBJECT, nickname, { timeout: 7000 })

      const lands: UserLands = JSON.parse(
        new TextDecoder().decode(req.data)
      )

      ctx.header('Cache-Control', 'public, max-age=60')
      
      return ctx.json({ data: lands }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })