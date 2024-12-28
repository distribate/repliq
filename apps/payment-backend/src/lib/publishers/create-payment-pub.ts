import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema.ts';
import { nc } from '../../shared/nats-client.ts';

const subj = "payment.status.success"

export async function createPaymentPub(payment: PaymentCompleted["data"]) {
  return nc.publish(subj, JSON.stringify(payment))
}