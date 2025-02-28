import { getNatsConnection } from "@repo/config-nats/nats-client"
import { paymentMetaSchema, paymentTypeValidator } from "@repo/types/schemas/payment/payment-schema"
import { PAYMENT_SUCCESS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import type { PaymentMeta } from "@repo/types/entities/payment-types"
import { processCharismPayment } from "#utils/process-charism-payment.ts"
import { processDonatePayment } from "#utils/process-donate-payment.ts"
import { processBelkoinPayment } from "#utils/process-belkoin-payment.ts"

const receiveFiatPayload = paymentMetaSchema.superRefine((data, ctx) => paymentTypeValidator({ data, ctx }))

export const subscribeReceiveFiatPayment = () => {
  const nc = getNatsConnection()

  return nc.subscribe(PAYMENT_SUCCESS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const message = msg.json<PaymentMeta>()

      const { success, data } = receiveFiatPayload.safeParse(message)

      if (!success) return;

      try {
        switch (data.paymentType) {
          case "donate":
            return processDonatePayment(data)
          case "belkoin":
            return processBelkoinPayment(data)
          case "charism":
            return processCharismPayment(data)
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
}