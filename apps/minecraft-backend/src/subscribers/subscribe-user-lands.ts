import { getNatsConnection } from "@repo/config-nats/nats-client";
import { getLandsByNickname } from "#lib/queries/get-lands-by-nickname.ts";

export const subscribeUserLands = () => {
  const nc = getNatsConnection()

  return nc.subscribe("get-user-lands", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const nickname = new TextDecoder().decode(msg.data)

      try {
        const lands = await getLandsByNickname(nickname)

        if (!lands) {
          return msg.respond(JSON.stringify([]))
        }

        return msg.respond(JSON.stringify(lands))
      } catch (e) {
        console.error(e)
      }
    }
  })
}