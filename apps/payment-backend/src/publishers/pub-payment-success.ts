import { getNatsConnection } from "@repo/config-nats/nats-client"
import { PAYMENT_SUCCESS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import type { PaymentMeta } from "@repo/types/entities/payment-types"

export function publishPaymentSuccess(meta: PaymentMeta) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    nickname: meta.nickname,
    paymentType: meta.paymentType,
    paymentValue: String(meta.paymentValue),
  })

  return nc.publish(PAYMENT_SUCCESS_SUBJECT, payload)
}