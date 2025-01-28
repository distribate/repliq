import { getNatsConnection } from "@repo/config-nats/nats-client"

type PublishReferalReward = {
  referrer: string,
  referral: string
}

export const publishReferalReward = ({
  referral, referrer
}: PublishReferalReward) => {
  const nc = getNatsConnection()

  const payload = JSON.stringify({ referrer, referral })

  return nc.publish("users.referal.reward", payload)
}