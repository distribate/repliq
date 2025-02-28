import type { PaymentMeta } from "@repo/types/entities/payment-types";
import { setPlayerGroup } from "./set-player-group";
import { publishPaymentNotify } from "#publishers/pub-payment-notify.ts";
import { callServerCommand } from "./call-command";
import { callBroadcast } from "./call-broadcast";
import { DONATE_TITLE } from "@repo/shared/constants/donate-aliases";
import { createErrorLog } from "./create-error-log";

export async function processDonatePayment({
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

  const message = `Игрок ${nickname} приобрел привилегию ${DONATE_TITLE[paymentValue as keyof typeof DONATE_TITLE]}`

  await Promise.all([
    callServerCommand({ parent: "cmi", value: `toast ${nickname} Поздравляем с покупкой!` }),
    callBroadcast(message)
  ])
}