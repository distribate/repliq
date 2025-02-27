import { CRYPTO_PAY_API } from "#shared/api/crypto-api.ts";
import { paymentsDB } from "#shared/database/payments-db.ts";
import type { ExchangeRate } from "#types/payment-types.ts";
import type { PaymentCryptoCurrency, PaymentDonateType, PaymentMeta } from "@repo/types/entities/payment-types";

type GetItemPrice = {
  currency: PaymentCryptoCurrency
  meta: Omit<PaymentMeta, "nickname">
}

function getDiff(rubPrice: number, exchangeRate: number): number {
  const priceInTargetCurrency = rubPrice / exchangeRate;
  return parseFloat(priceInTargetCurrency.toFixed(8));
}

async function getDonatePrice(value: PaymentDonateType) {
  return paymentsDB
    .selectFrom("donate")
    .select("price")
    .where("origin", "=", value)
    .executeTakeFirst()
}

async function getWalletPrice(value: "charism" | "belkoin") {
  return await paymentsDB
    .selectFrom("economy")
    .select("value")
    .where("type", "=", value)
    .executeTakeFirst()
}

export async function getItemPrice({ 
  meta, currency 
}: GetItemPrice): Promise<number> {
  let rubPrice: number | null = null;

  const { paymentType, paymentValue } = meta;

  if (paymentType === "donate") {
    const donateQuery = await getDonatePrice(paymentValue as PaymentDonateType)

    if (!donateQuery) {
      throw new Error("Item not found")
    }

    rubPrice = Number(donateQuery.price);
  } else if (paymentType === "charism" || paymentType === "belkoin") {
    const walletQuery = await getWalletPrice(paymentType as "charism" | "belkoin")

    if (!walletQuery) {
      throw new Error("Item not found")
    }

    rubPrice = Number(paymentValue) * Number(walletQuery.value)
  } else if (paymentType === 'event') {
    throw new Error("Not supported payment type")
  } else if (paymentType === 'item') {
    throw new Error("Not supported payment type")
  }

  if (!rubPrice) {
    throw new Error("Invalid price")
  }

  const exchangeRate = await CRYPTO_PAY_API
    .get("getExchangeRates")
    .json<{ ok: boolean, result: ExchangeRate[] }>()

  const selectedCurrency = exchangeRate.result.find(
    d => d.source === currency && d.target === 'RUB'
  )

  if (!selectedCurrency) {
    throw new Error("Currency not found")
  }

  const price = getDiff(rubPrice, Number(selectedCurrency.rate))

  return price;
}