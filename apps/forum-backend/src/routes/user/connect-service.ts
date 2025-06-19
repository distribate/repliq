import { forumDB } from "#shared/database/forum-db.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { zValidator } from "@hono/zod-validator"
import { Kvm } from "@nats-io/kv"
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { throwError } from "@repo/lib/helpers/throw-error"
import { logger } from "@repo/lib/utils/logger"
import { Hono } from "hono"
import { nanoid } from "nanoid"
import { z } from "zod/v4"

const connectServiceRouteSchema = z.object({
  type: z.enum(["connect", "disconnect", "cancel"]),
  service: z.enum(["telegram", "discord"])
})

const getToken = (i: string) => `token-${i}`
const getRateToken = (i: string) => `ratelimit-${i}`

const BOT_URL = "https://t.me/fasberry_bot"

export const connectServiceRoute = new Hono()
  .post("/connect", zValidator("query", connectServiceRouteSchema), async (ctx) => {
    const data = connectServiceRouteSchema.parse(ctx.req.query())
    const nickname = getNickname()

    const { type, service } = data

    try {
      const nc = getNatsConnection()
      const kvm = new Kvm(nc);
      const kv = await kvm.open("connect_tokens");

      let isExist = await kv.get(getRateToken(nickname))

      if (type === 'cancel') {
        return ctx.json({ data: null, status: "Success" }, 200)
      }

      if (type === 'disconnect') {
        const query = await forumDB
          .deleteFrom("users_connections")
          .where("nickname", "=", nickname)
          .executeTakeFirst()

        if (!query.numDeletedRows) {
          return ctx.json({ error: "Error" }, 500)
        }

        return ctx.json({ data: null, status: "Success" }, 200)
      }

      if (type === 'connect') {
        let tries: number = 0;
        
        if (isExist) {
          tries = Number(isExist.string())

          if (tries >= 5) {
            return ctx.json({ error: "Exists token" }, 402)
          }
        }

        const token = nanoid(6).toUpperCase()
        const payload = JSON.stringify({ nickname, service })
        const ratePayload = (tries + 1).toString()

        await Promise.all([
          kv.put(getToken(token), payload),
          kv.put(getRateToken(nickname), ratePayload)
        ])

        const botStartConnectUrl = `${BOT_URL}?connect=${token}`

        logger.info(`Created request for connection (${nickname}, ${token}, ${service})`)

        return ctx.json({ data: botStartConnectUrl, status: "Started" }, 200)
      }

      return ctx.json({ error: "Invalid action type" }, 400);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })
