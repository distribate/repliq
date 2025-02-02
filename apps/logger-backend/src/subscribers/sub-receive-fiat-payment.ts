import { getNatsConnection } from "@repo/config-nats/nats-client"
import { setPlayerGroup } from "../utils/set-player-group"
import { callServerCommand } from "../utils/call-command"
import { commandValue } from "../messages/broadcasts"
import { callBroadcast } from "../utils/call-broadcast"
import { paymentMetaSchema, paymentTypeValidator } from "@repo/types/schemas/payment/payment-schema"
import { DONATE_TITLE } from "@repo/shared/constants/donate-aliases.ts"
import { PaymentMeta } from "@repo/types/entities/payment-types"
import { giveBelkoin } from "../utils/give-belkoin"
import { giveCharism } from "../utils/give-charism"
import { publishPaymentNotify } from "../publishers/pub-payment-notify"
import { createErrorLog } from "../utils/create-error-log"

const receiveFiatPayload = paymentMetaSchema
  .superRefine((data, ctx) => paymentTypeValidator({ data, ctx }))

async function processBelkoinPayment({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  await Promise.all([
    giveBelkoin(nickname, Number(paymentValue)),
    callServerCommand({
      parent: "cmi",
      value: `toast ${nickname} Поздравляем c покупкой`
    }),
    callBroadcast(
      `Игрок ${nickname} приобрел ${paymentValue} ед. белкоинов`
    ),
  ])

  publishPaymentNotify({ nickname, paymentType, paymentValue })
}

async function processCharismPayment({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  await Promise.all([
    giveCharism(nickname, Number(paymentValue)),
    callServerCommand({
      parent: "cmi",
      value: `toast ${nickname} Поздравляем с покупкой`
    }),
    callBroadcast(
      `Игрок ${nickname} приобрел ${paymentValue} ед. харизмы`
    ),
  ])

  publishPaymentNotify({ nickname, paymentType, paymentValue })
}

async function processDonatePayment({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  const r = await setPlayerGroup(nickname, `group.${paymentValue}`)

  // if invalid update a group
  if (!r) {
    await createErrorLog({
      description: `Invalid group ${paymentValue} for nickname ${nickname}`,
      initiator: "logger",
      recipient: nickname,
      type: "payment"
    })

    return;
  }

  publishPaymentNotify({ nickname, paymentType, paymentValue })

  await Promise.all([
    callServerCommand({ parent: "cmi", value: commandValue(nickname) }),
    callBroadcast(
      `Игрок ${nickname} приобрел привилегию ${DONATE_TITLE[paymentValue as keyof typeof DONATE_TITLE]}`
    )
  ])
}

export const PAYMENT_SUCCESS_SUBJECT = "payment.status.success"

export const subscribeReceiveFiatPayment = () => {
  const nc = getNatsConnection()

  return nc.subscribe(PAYMENT_SUCCESS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const message = msg.json<PaymentMeta>()

      console.log(message)

      const { success, data } = receiveFiatPayload.safeParse(message)

      console.log(`Payment status: ${success ? "success" : "failure"}`)

      if (!success) return;

      const { nickname, paymentType, paymentValue } = data;

      try {
        const val = { nickname, paymentType, paymentValue }

        switch (paymentType) {
          case "donate":
            return processDonatePayment(val)
          case "belkoin":
            return processBelkoinPayment(val)
          case "charism":
            return processCharismPayment(val)
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
}