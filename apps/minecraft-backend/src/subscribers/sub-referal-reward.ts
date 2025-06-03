import { getNatsConnection } from "@repo/config-nats/nats-client";
import { callServerCommand } from "../utils/call-command";
import { USER_REFERAL_REWARD_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { natsLogger } from "@repo/lib/utils/logger";

type ReferalRewardPayload = {
  referrer: string,
  referral: string
}

export const subscribeReferalReward = () => {
  const nc = getNatsConnection()

  natsLogger.success("Subscribed to referal reward")

  return nc.subscribe(USER_REFERAL_REWARD_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const payload = msg.json<ReferalRewardPayload>()

      if (!payload) return;

      try {
        await Promise.all([
          callServerCommand({ parent: "cmi", value: `money give ${payload.referral} 50` }),
          callServerCommand({ parent: "p", value: `give ${payload.referrer} 1` })
        ])
      } catch (e) {
        console.error(e);
      }
    }
  })
}