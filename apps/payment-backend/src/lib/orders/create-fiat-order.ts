import { getNatsConnection } from "@repo/config-nats/nats-client"
import { PAYMENT_FIAT_START_SUBJECT } from "@repo/shared/constants/nats-subjects"
import type { PaymentMeta } from "@repo/types/entities/payment-types"
import type { paymentFiatMethodSchema } from "@repo/types/schemas/payment/payment-schema"
import type { z } from "zod"

type CreateFiatOrder = PaymentMeta & {
  type: z.infer<typeof paymentFiatMethodSchema>
}

type CreateFiatOrderResponse = {
  IsSuccess: boolean,
  ErrorCode: number,
  Data: string,
  ErrorMessage?: string
}

export async function createFiatOrder({
  paymentValue, paymentType, nickname, type
}: CreateFiatOrder) {
  const nc = getNatsConnection()

  const payload: CreateFiatOrder = {
    nickname, paymentType, paymentValue: String(paymentValue), type
  }

  const res = await nc.request(
    PAYMENT_FIAT_START_SUBJECT, JSON.stringify(payload), { timeout: 10000 }
  )

  const { IsSuccess, ErrorCode, Data, ErrorMessage } = res.json<CreateFiatOrderResponse>()

  return { isSuccess: IsSuccess, errorCode: ErrorCode, data: Data, errorMessage: ErrorMessage }
}