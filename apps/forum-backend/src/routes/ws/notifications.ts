import { getNickname } from "#utils/get-nickname-from-storage.ts";
import type { Subscription } from "@nats-io/transport-node";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>()

type NotificationObject =
  | { type: "create-friend-request", payload: { recipient: string, initiator: string } }
  | { type: "accept-friend-request", payload: { recipient: string, initiator: string } }

export const notificationsRoute = new Hono()
  .get("/notifications", upgradeWebSocket(async (ctx) => {
    const nickname = getNickname()
    const nc = getNatsConnection()

    let subscription: Subscription;

    return {
      onOpen: async (event, ws) => {
        try {
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

                  ws.send(JSON.stringify(payload))
                  break;
                case "accept-friend-request":
                  if (recipient === nickname) {
                    return;
                  }

                  ws.send(JSON.stringify(payload))
                  break;
              }
            },
          })

          console.log("[Notifications]: Connection opened")
        } catch (e) {
          console.error("[Notifications]: Error subscribing: ", e);
        }
      },
      onClose: async (event) => {
        if (subscription) {
          subscription.unsubscribe()
          console.log('[Notifications]: Nats connection drained')
        }

        console.log('[Notifications]: Connection closed')
      },
      onError: async (error) => {
        if (subscription) {
          subscription.unsubscribe()
          console.log('[Notifications]: Nats connection drained')
        }

        console.log('[Notifications]: Connection error', error)
      },
    }
  }))