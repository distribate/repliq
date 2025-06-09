import { CRYPTO_PAY_API } from "#shared/api/crypto-api.ts";
import { CALLBACK_REDIRECT_URL, DEFAULT_EXPIRATION_DATE } from "#shared/constants/invoice-defaults.ts";
import { paymentsDB } from "#shared/database/payments-db.ts";
import type { InvoiceType } from "#types/payment-types.ts";
import { getItemPrice } from "#utils/get-item-price.ts";
import { getPaymentDetails } from "#utils/get-payment-details.ts";
import type { PaymentMeta } from "@repo/types/entities/payment-types";
import { currencyCryptoSchema } from "@repo/types/schemas/entities/currencies-schema";
import { z } from "zod/v4";

export type CreateCryptoOrder = PaymentMeta & {
  currency: z.infer<typeof currencyCryptoSchema>
}

type CreateInvoicePayload = Pick<InvoiceType,
  | "currency_type"
  | "asset"
  | "amount"
  | "description"
  | "hidden_message"
  | "paid_btn_name"
  | "paid_btn_url"
  | "payload"
> & {
  expires_in?: number
}

export async function createCryptoOrder({
  nickname, paymentType, paymentValue, currency,
}: CreateCryptoOrder): Promise<{ url: string, orderId: string } | null> {
  const [amount, paymentDetails] = await Promise.all([
    getItemPrice({ meta: { paymentType, paymentValue }, currency }),
    getPaymentDetails({ paymentType, paymentValue })
  ])

  if (!amount) {
    throw new Error("Amount or item not found")
  }

  const metaPayload = JSON.stringify({ nickname, paymentType, paymentValue })

  let description: string = `${paymentType} | ${paymentValue} | ${nickname}`;

  if (paymentDetails) {
    switch (paymentType) {
      case "donate":
        description = `Покупка привилегии ${paymentDetails?.title} для игрока ${nickname}`
        break;
      case "charism":
      case "belkoin":
        description = `Покупка ${paymentDetails?.title} в количестве ${paymentValue} для игрока ${nickname}`
        break;
      case "item":
      case "event":
        break;
    }
  }

  const createInvoicePayload: CreateInvoicePayload = {
    currency_type: "crypto",
    asset: currency,
    amount: amount.toString(),
    description,
    paid_btn_name: "callback",
    paid_btn_url: CALLBACK_REDIRECT_URL,
    payload: metaPayload,
    expires_in: DEFAULT_EXPIRATION_DATE
  }

  const res = await CRYPTO_PAY_API.post("createInvoice", {
    json: createInvoicePayload
  }).json<{ ok: boolean, result: InvoiceType }>()

  await paymentsDB
    .insertInto("payments_crypto")
    .values({
      status: "created",
      currency,
      nickname,
      orderid: res.result.hash,
      payment_type: paymentType,
      payment_value: paymentValue.toString(),
      price: amount
    })
    .returning("orderid")
    .executeTakeFirstOrThrow()

  return { orderId: res.result.hash, url: res.result.pay_url }
}