import { getNatsConnection } from "@repo/config-nats/nats-client";
import { callServerCommand } from "../utils/call-command";

export const subscribeReferalReward = () => {
  const nc = getNatsConnection()

  return nc.subscribe("users.referal.reward", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      setImmediate(async () => {
        const payload: { referrer: string, referral: string } = msg.json()

        if (payload) {
          try {
            await callServerCommand({
              parent: "cmi",
              value: `money give ${payload.referral} 50`
            })

            await callServerCommand({
              parent: "p",
              value: `give ${payload.referrer} 1`
            })
          } catch (error) {
            console.error("Error sending notify: ", error);
          }
        }
      })
    }
  })
}