import { getNatsConnection } from '@repo/config-nats/nats-client';
import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema.ts';

type PaymentStatus = "success" | "failed"

export async function pubPaymentPayload(status: PaymentStatus, payment: PaymentCompleted["data"]) {
  const nc = getNatsConnection()
  
  return nc.publish(`payment.status.${status}`, JSON.stringify(payment))
}