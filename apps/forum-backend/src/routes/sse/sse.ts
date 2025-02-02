import type { Subscription } from "@nats-io/transport-node";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { Hono } from "hono";
import { streamSSE, stream, streamText } from 'hono/streaming'

let id: number = 0

export const sseRoute = new Hono()
  .get("/stream", async (ctx) => {
    ctx.header('Content-Type', 'text/event-stream');
    ctx.header('Cache-Control', 'no-cache');
    ctx.header('Connection', 'keep-alive');

    const nc = getNatsConnection();

    let subscription: Subscription | null = null;

    return streamSSE(ctx, async (stream) => {
      stream.onAbort = () => {
        stream.close();
        console.log(id, 'abort signal received');
      };

      while (true) {
        const message = `It is ${new Date().toISOString()}`

        // console.log(message);

        await stream.writeSSE({
          data: message,
          event: 'time-update',
          id: String(id++),
        })

        await stream.sleep(1000);
      }
    })

    // return streamSSE(ctx, async (stream) => {
    //   try {
    //     subscription = nc.subscribe("test", {
    //       callback: async (err, msg) => {
    //         if (err) {
    //           console.error(err)
    //           return
    //         }

    //         const payload = JSON.parse(new TextDecoder().decode(msg.data))

    //         console.log(payload)

    //         await stream.writeSSE({
    //           data: payload,
    //           event: "message",
    //           id: String(id++),
    //         })
    //       }
    //     })

    //     console.log("subscribed")

    //     stream.onAbort(() => {
    //       console.log("aborted")
    //       if (subscription) {
    //         subscription.unsubscribe()
    //       }
    //     })
    //   } catch (e) {
    //     console.error(e);

    //     if (subscription) {
    //       subscription.unsubscribe()
    //     }

    //     subscription = null
    //   }
    // }, async (err, stream) => {
    //   console.error(err);

    //   await stream.writeln('An error occurred!')

    //   if (subscription) {
    //     subscription.unsubscribe()
    //   }

    //   subscription = null
    // })
  })