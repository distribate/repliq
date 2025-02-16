import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { throwError } from "@repo/lib/helpers/throw-error";
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

      const req = await nc.request("get-user-lands", nickname)

      const lands: UserLands = JSON.parse(
        new TextDecoder().decode(req.data)
      )

      return ctx.json({ data: lands }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })