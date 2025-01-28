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

const receiveFiatPayload = paymentMetaSchema
  .superRefine((data, ctx) => paymentTypeValidator({ data, ctx }))
  
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

export const PAYMENT_SUCCESS_SUBJECT = "payment.status.success"

export const subscribePaymentCheck = () => {
  const nc = getNatsConnection()

  return nc.subscribe("payment.check", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err)
        return;
      }

      const payload = msg.json<Pick<PaymentMeta, "paymentType" | "paymentValue">>()

      if (!payload) return;


    }
  })
}

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