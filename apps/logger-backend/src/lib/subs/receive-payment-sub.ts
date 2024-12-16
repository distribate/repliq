import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema';
import { nofifyPaymentReceived } from '#lib/events/nofify-payment-received';
import { NatsConnection } from '@nats-io/transport-node';

const subj = "payment.status.success"

export async function receivePaymentSub(nc: NatsConnection) {
  return nc.subscribe(subj, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const payment: PaymentCompleted['data'] = msg.json()
      
      if (payment.status === 'received') {
        try {
          await nofifyPaymentReceived(payment)
        } catch (error) {
          console.error("Error sending notify: ", error);
        }
      }
    }
  })
}