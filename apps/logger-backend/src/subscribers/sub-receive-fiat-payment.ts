import { getNatsConnection } from "@repo/config-nats/nats-client"
import { setPlayerGroup } from "../utils/set-player-group"
import { callServerCommand } from "../utils/call-command"
import { commandValue } from "../messages/broadcasts"
import { callBroadcast } from "../utils/call-broadcast"
import { USER_NOTIFICATIONS_SUBJECT } from "@repo/shared/constants/nats-subjects"
import { paymentMetaSchema, paymentTypeValidator } from "@repo/types/schemas/payment/payment-schema"
import { DONATE_TITLE } from "@repo/shared/constants/donate-aliases.ts"
import { PaymentMeta } from "@repo/types/entities/payment-types"
import { giveBelkoin } from "../utils/give-belkoin"
import { giveCharism } from "../utils/give-charism"

const receiveFiatPayload = paymentMetaSchema
  .superRefine((data, ctx) => paymentTypeValidator({ data, ctx }))

async function publishPaymentNotify({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    type: "payment",
    payload: { nickname, paymentType, paymentValue }
  })

  return nc.publish(USER_NOTIFICATIONS_SUBJECT, payload)
}

async function processBelkoinPayment({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  return await Promise.all([
    giveBelkoin(nickname, Number(paymentValue)),
    callServerCommand({
      parent: "cmi",
      value: `toast ${nickname} Поздравляем c покупкой`
    }),
    callBroadcast(
      `Игрок ${nickname} приобрел ${paymentValue} ед. белкоинов`
    ),
    publishPaymentNotify({ nickname, paymentType, paymentValue })
  ])
}

async function processCharismPayment({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  return await Promise.all([
    giveCharism(nickname, Number(paymentValue)),
    callServerCommand({
      parent: "cmi",
      value: `toast ${nickname} Поздравляем с покупкой`
    }),
    callBroadcast(
      `Игрок ${nickname} приобрел ${paymentValue} ед. харизмы`
    ),
    publishPaymentNotify({ nickname, paymentType, paymentValue })
  ])
}

async function processDonatePayment({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  return await Promise.all([
    setPlayerGroup(nickname, `group.${paymentValue}`),
    callServerCommand({ parent: "cmi", value: commandValue(nickname) }),
    callBroadcast(
      `Игрок ${nickname} приобрел привилегию ${DONATE_TITLE[paymentValue as keyof typeof DONATE_TITLE]}`
    ),
    publishPaymentNotify({ nickname, paymentType, paymentValue })
  ])
}

export const subscribeReceiveFiatPayment = () => {
  const nc = getNatsConnection()

  return nc.subscribe("payment.status.success", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const message = msg.json<PaymentMeta>()

      const { nickname, paymentType, paymentValue } = receiveFiatPayload.parse(message)

      try {
        const val = { nickname, paymentType, paymentValue }

        switch (paymentType) {
          case "donate":
            return await processDonatePayment(val)
          case "belkoin":
            return await processBelkoinPayment(val)
          case "charism":
            return await processCharismPayment(val)
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
}