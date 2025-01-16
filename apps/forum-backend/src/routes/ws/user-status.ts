import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { updateUserStatus } from "#lib/queries/user/update-user-status.ts";
import { WEBSOCKET_PING_INTERVAL } from "#shared/constants/websockets.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { Subscription } from "@nats-io/transport-node";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { forumDB } from "#shared/database/forum-db.ts";

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>()

type NotificationObject =
  | { type: "create-friend-request", payload: { recipient: string, initiator: string } }
  | { type: "accept-friend-request", payload: { recipient: string, initiator: string } }

async function getUserNotificationsPreference(nickname: string) {
  const query = await forumDB
  .selectFrom("users_settings")
  .select("send_notifications")
  .where("nickname", "=", nickname)
  .executeTakeFirstOrThrow()

  return query.send_notifications
}

export const userStatusRoute = new Hono()
  .get("/user-status", upgradeWebSocket(async (ctx) => {
    const nickname = getNickname()
    const nc = getNatsConnection()

    let pingInterval: Timer;
    let subscription: Subscription | null = null;

    const notificationsPreference = await getUserNotificationsPreference(nickname)

    return {
      onOpen: async (event, ws) => {
        console.log('[UserStatus]: Connection opened')

        pingInterval = setInterval(() => {
          if (ws.readyState === 1) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, WEBSOCKET_PING_INTERVAL);

        try {
          if (!notificationsPreference) {
            console.log("[Notifications]: Connection canceled. User has disabled notifications.");
            return;
          }

          subscription = nc.subscribe(USER_NOTIFICATIONS_SUBJECT, {
            callback: async (error, msg) => {
              if (error) {
                console.error(error)
                return;
              }

              const message = msg.json<NotificationObject>()
              const { payload, type } = message;
              const { initiator, recipient } = payload;

              switch (type) {
                case "create-friend-request":
                  if (initiator === nickname) {
                    return;
                  }

                  ws.send(JSON.stringify({ type, payload }))
                  break;
                case "accept-friend-request":
                  if (recipient === nickname) {
                    return;
                  }

                  ws.send(JSON.stringify({ type, payload }))
                  break;
              }
            },
          })

          console.log("[Notifications]: Connection opened")
        } catch (e) {
          console.error("[Notifications]: Error subscribing: ", e);
        }
      },
      onMessage: async (event, ws) => {
        try {
          const data = JSON.parse(event.data.toString());

          if (data.type === "status") {
            await updateUserStatus(nickname, true)
          }

          if (data.type === "pong") {
            console.log(`[UserStatus]: Received pong from ${data.nickname}`);
          }

        } catch (error) {
          console.error("[UserStatus]: Error handling WebSocket message:", error);
        }
      },
      onError: async (error) => {
        await updateUserStatus(nickname, false)

        if (subscription) {
          subscription.unsubscribe()
          console.log('[Notifications]: Nats connection unsubscribed')
        }

        console.error("[UserStatus]: WebSocket error:", error);
      },
      onClose: async (event) => {
        await updateUserStatus(nickname, false);

        if (subscription) {
          subscription.unsubscribe()
          console.log('[Notifications]: Nats connection unsubscribed')
        }

        if (pingInterval) {
          clearInterval(pingInterval);
        }

        console.log('[UserStatus]: Connection closed')
      },
    }
  }))