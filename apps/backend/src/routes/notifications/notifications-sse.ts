import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { updateEvent, config, ping } from "@repo/shared/constants/sse-events"
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { NotificationsEventsPayload, ConfigEventsData } from "@repo/types/entities/notifications-events-type";
import { forumDB } from "#shared/database/forum-db.ts";

const KEEPALIVE_TIME = 5000

async function validateUserNotificationsPreference(nickname: string) {
  const query = await forumDB
    .selectFrom("users_settings")
    .select("send_notifications")
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow()

  return query.send_notifications;
}

export const notificationsSSERoute = new Hono()
  .get("/notifications/connect", async (ctx) => {
    const nickname = getNickname()
    
    const isValid = await validateUserNotificationsPreference(nickname)

    const nc = getNatsConnection()
    
    const sub = nc.subscribe(updateEvent)

    return streamSSE(ctx, async (stream) => {
      while (true) {
        // const controller = new AbortController()

        // ctx.req.raw.signal.addEventListener('abort', () => {
        //   console.log('aborted by client');
        //   controller.abort()
        //   sub.unsubscribe()
        //   stream.close()
        // })

        const id = String(Date.now())

        if (!isValid) {
          await stream.writeSSE({ event: config, data: "Exit" as ConfigEventsData, id });
          // stream.close();
          return;
        }

        await stream.writeSSE({ event: config, data: "Established" as ConfigEventsData, id });

        const keepAlive = setInterval(async () => {
          // if (stream.closed || stream.aborted) {
          //   clearInterval(keepAlive)
          //   sub.unsubscribe()
          //   return
          // }

          await stream.writeSSE({ event: ping, data: "keep-alive" });
        }, KEEPALIVE_TIME);

        try {
          for await (const msg of sub) {
            const payload: NotificationsEventsPayload = JSON.parse(
              new TextDecoder().decode(msg.data)
            )
            if (!payload) return;

            if (payload.event === 'global') {
              await stream.writeSSE({
                data: JSON.stringify(payload), event: updateEvent, id,
              });
            } else if (payload.for === nickname) {
              await stream.writeSSE({
                data: JSON.stringify(payload), event: updateEvent, id,
              });
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          clearInterval(keepAlive);
          sub.unsubscribe()
          // stream.close()
        }
      }
    })
  })