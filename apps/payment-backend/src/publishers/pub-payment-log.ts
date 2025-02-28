import { getNatsConnection } from "@repo/config-nats/nats-client"
import { getPaymentDetails } from "#utils/get-payment-details.ts"
import type { PaymentMeta } from "@repo/types/entities/payment-types"
import { LOGS_PAYMENT_SUBJECT } from "@repo/shared/constants/nats-subjects"

export type PaymentReceived = {
  item: string,
  nickname: string,
  orderId: string
}

type PublishPaymentLog = PaymentMeta & { orderId: string }

export const publishPaymentLog = async (data: PublishPaymentLog) => {
  const nc = getNatsConnection()

  const paymentDetails = await getPaymentDetails(data)

  let item: string = ""

  if (data.paymentType === "donate") {
    item = `привилегия ${paymentDetails?.title}`
  } else if (data.paymentType === "charism" || data.paymentType === "belkoin") {
    item = `валюта ${paymentDetails?.title} в кол-ве ${data.paymentValue}`
  }

  const payload: PaymentReceived = {
    item,
    nickname: data.nickname,
    orderId: data.orderId
  }

  return nc.publish(LOGS_PAYMENT_SUBJECT, JSON.stringify(payload))
}