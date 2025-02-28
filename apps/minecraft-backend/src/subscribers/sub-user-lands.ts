import { getNatsConnection } from "@repo/config-nats/nats-client";
import { getLandsByNickname } from "#lib/queries/get-lands-by-nickname.ts";
import { USER_GET_LANDS_SUBJECT } from "@repo/shared/constants/nats-subjects";

export const subscribeUserLands = () => {
  const nc = getNatsConnection()

  return nc.subscribe(USER_GET_LANDS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const nickname = new TextDecoder().decode(msg.data)

      if (!nickname) return;

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