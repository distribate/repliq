import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_REFERAL_REWARD_SUBJECT } from "@repo/shared/constants/nats-subjects"

type PublishReferalReward = {
  referrer: string,
  referral: string
}

export const publishReferalReward = ({
  referral, referrer
}: PublishReferalReward) => {
  const nc = getNatsConnection()

  const payload = JSON.stringify({ referrer, referral })

  return nc.publish(USER_REFERAL_REWARD_SUBJECT, payload)
}