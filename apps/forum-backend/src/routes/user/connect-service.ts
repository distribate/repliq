import { forumDB } from "#shared/database/forum-db.ts"
import { getNickname } from "#utils/get-nickname-from-storage.ts"
import { zValidator } from "@hono/zod-validator"
import { Kvm } from "@nats-io/kv"
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { throwError } from "@repo/lib/helpers/throw-error"
import { logger } from "@repo/lib/utils/logger"
import { CONNECT_SOCIAL_SUBJECT, DISCONNECT_SOCIAL_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { config } from "@repo/shared/constants/sse-events"
import type { ConfigEventsData } from "@repo/types/entities/notifications-events-type"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { nanoid } from "nanoid"
import * as z from "zod"

const connectServiceRouteSchema = z.object({
  type: z.enum(["connect", "disconnect", "cancel"]),
  service: z.enum(["telegram", "discord"])
})

const getToken = (i: string) => `token-${i}`
const getRateToken = (i: string) => `ratelimit-${i}`

const BOT_URL = `https://t.me/${process.env.REPLIQ_BOT_USERNAME}`

type ConnectServicePayload = {
  service: string,
  nickname: string,
  status: "success" | "error"
}

type DisconnectServicePayload = {
  serviceId: string,
  nickname: string,
  status: "success" | "error"
}

export const connectServiceSSE = new Hono()
  .get("/connect-service/sse", async (ctx) => {
    const nickname = getNickname()

    const nc = getNatsConnection()
    const sub = nc.subscribe(CONNECT_SOCIAL_SUBJECT)

    return streamSSE(ctx, async (stream) => {
      while (true) {
        const id = String(Date.now())

        await stream.writeSSE({
          event: config, data: "Established" as ConfigEventsData, id,
        });

        const keepAlive = setInterval(async () => {
          await stream.writeSSE({ event: "ping", data: "keep-alive" });
        }, 5000);

        try {
          for await (const msg of sub) {
            const data = new TextDecoder().decode(msg.data)
            if (!data) return;

            const payload: ConnectServicePayload = JSON.parse(data)

            if (payload.nickname === nickname) {
              await stream.writeSSE({ data, event: "payload", id });
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            logger.error(err.message);
          }
        } finally {
          clearInterval(keepAlive);
          sub.unsubscribe()
        }
      }
    })
  })

export const connectServiceRoute = new Hono()
  .post("/connect", zValidator("query", connectServiceRouteSchema), async (ctx) => {
    const data = connectServiceRouteSchema.parse(ctx.req.query())
    const nickname = getNickname()

    const { type, service } = data

    if (type === 'connect') {
      const isExistsConnection = await forumDB
        .selectFrom("users_connections")
        .select('id')
        .where("type", "=", service)
        .where("nickname", "=", nickname)
        .executeTakeFirst()

      if (isExistsConnection) {
        return ctx.json({ error: "Connection is exists" }, 401)
      }
    }

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
          .returning("value")
          .executeTakeFirst()

        if (!query?.value) {
          return ctx.json({ error: "Error" }, 500)
        }

        const payload: DisconnectServicePayload = {
          serviceId: query.value,
          nickname,
          status: "success"
        }

        nc.publish(DISCONNECT_SOCIAL_SUBJECT, JSON.stringify(payload))

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

        const botStartConnectUrl = `${BOT_URL}?start=connect_${token}`

        logger.info(`Created request for connection (${nickname}, ${token}, ${service})`)

        return ctx.json({ data: botStartConnectUrl, status: "Started" }, 200)
      }

      return ctx.json({ error: "Invalid action type" }, 400);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })
