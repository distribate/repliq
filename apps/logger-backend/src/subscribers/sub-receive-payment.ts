import type { PaymentCompleted } from '@repo/types/schemas/payment/payment-schema';
import { getNatsConnection } from '@repo/config-nats/nats-client.ts';
import { nofifyPaymentReceived } from '../utils/nofify-payment-received';
import { PAYMENT_STATUS_SUBJECT } from '@repo/shared/constants/nats-subjects';

type PaymentReceived = {
  status: "received"
  payload: PaymentCompleted['data']
}

export function subscribeReceivePayment() {
  const nc = getNatsConnection()

  return nc.subscribe(PAYMENT_STATUS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const payment = msg.json<PaymentReceived>()
      
      if (payment.status === 'received') {
        try {
          await nofifyPaymentReceived({
            ...payment.payload
          })
        } catch (error) {
          console.error("Error sending notify: ", error);
        }
      }
    }
  })
}