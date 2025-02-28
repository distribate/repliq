import type { PaymentMeta } from "@repo/types/entities/payment-types"
import { giveBelkoin } from "./give-belkoin"
import { callServerCommand } from "./call-command"
import { callBroadcast } from "./call-broadcast"
import { publishPaymentNotify } from "#publishers/pub-payment-notify.ts"

export async function processBelkoinPayment({
  nickname, paymentType, paymentValue
}: PaymentMeta) {
  const value = Number(paymentValue)
  const message = `Игрок ${nickname} приобрел ${paymentValue} ед. белкоинов`

  await Promise.all([
    giveBelkoin(nickname, value),
    callServerCommand({ parent: "cmi", value: `toast ${nickname} Поздравляем c покупкой` }),
    callBroadcast(message),
  ])

  publishPaymentNotify({ nickname, paymentType, paymentValue })
}