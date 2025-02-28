import { getNatsConnection } from "@repo/config-nats/nats-client"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import type { PaymentMeta } from "@repo/types/entities/payment-types"

export function publishPaymentNotify({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    type: "payment",
    payload: { nickname, paymentType, paymentValue }
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}