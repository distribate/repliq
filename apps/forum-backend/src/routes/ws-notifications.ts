import { Hono } from "hono";
import { streamSSE } from 'hono/streaming'
import { getNatsConnection } from "@repo/config-nats/nats-client"

export const wsNotificationsRoute = new Hono()
  .get("/notifications/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    if (!nickname) {
      return ctx.text("Nickname is required", 400);
    }


    return ctx.text('Hono!');

    // return streamSSE(ctx, async (stream) => {
    //   const nc = getNatsConnection();
    //   const subj = `forum.user.${nickname}.notifications`;

    //   const subscription = nc.subscribe(subj, {
    //     callback: async (err, msg) => {
    //       if (err) {
    //         console.error("NATS Error:", err);
    //         return;
    //       }

    //       const notification = msg.json();

    //       console.log(notification);

    //       await stream.writeSSE({
    //         data: JSON.stringify(notification),
    //         event: 'notification',
    //       });
    //     },
    //   });

    //   stream.onAbort(() => {
    //     subscription.unsubscribe();
    //     console.log("Client disconnected, unsubscribed from NATS.");
    //   });
    // }, async (err, stream) => {
    //   console.error("Stream Error:", err);
    //   stream.writeSSE({
    //     data: "Error occurred while processing notifications.",
    //     event: 'error',
    //   });
    // });
  }
  )