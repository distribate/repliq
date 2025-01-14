import { getNatsConnection } from '@repo/config-nats/nats-client';
import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema.ts';
import { PAYMENT_STATUS_SUBJECT } from '@repo/shared/constants/nats-subjects';

type PaymentStatus = "success" | "failed"

export async function pubPaymentPayload(status: PaymentStatus, payment: PaymentCompleted["data"]) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    status,
    payload: payment
  })

  return nc.publish(PAYMENT_STATUS_SUBJECT, payload)
}