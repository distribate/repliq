import { getNatsConnection } from '@repo/config-nats/nats-client.ts';
import { nofifyPaymentReceived } from '../utils/nofify-payment-received';
import { LOGS_PAYMENT_SUBJECT } from '@repo/shared/constants/nats-subjects';

export type PaymentReceived = {
  item: string,
  nickname: string,
  orderId: string
}

export function subscribeReceivePayment() {
  const nc = getNatsConnection()

  return nc.subscribe(LOGS_PAYMENT_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const payment = msg.json<PaymentReceived>()

      try {
        await nofifyPaymentReceived({ ...payment })
      } catch (error) {
        console.error("Error sending notify: ", error);
      }
    }
  })
}