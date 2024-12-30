import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema';
import { getNatsConnection } from '@repo/config-nats/nats-client.ts';
import { nofifyPaymentReceived } from '../utils/nofify-payment-received';

const subj = "payment.status.success"

export async function subReceivePayment() {
  const nc = getNatsConnection()

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