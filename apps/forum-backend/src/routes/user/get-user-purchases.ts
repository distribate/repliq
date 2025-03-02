import { donateIcons, donateTitles } from "#shared/constants/records.ts";
import { paymentsDB } from "#shared/database/payments-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import type { PaymentCryptoTonStatus, PaymentStatus } from "@repo/types/db/payments-database-types";
import { Hono } from "hono";
import type { PaymentMeta } from "@repo/types/entities/payment-types";

async function getFiatPayments(nickname: string) {
  const query = await paymentsDB
    .selectFrom("payments_fiat")
    .select([
      "id",
      "created_at",
      "orderid as order_id",
      "payment_type",
      "payment_value",
      "price",
      "status"
    ])
    .where("nickname", "=", nickname)
    .where("status", "=", "succeeded")
    .execute().then(p => p.map(p => ({ ...p, currency: "RUB" })))

  return query;
}

async function getCryptoPayments(nickname: string) {
  const query = await paymentsDB
    .selectFrom("payments_crypto")
    .select([
      "id",
      "created_at",
      "orderid as order_id",
      "payment_type",
      "currency",
      "price",
      "payment_value",
      "status"
    ])
    .where("nickname", "=", nickname)
    .where("status", "=", "received")
    .execute()

  return query;
}

function processDonatePayment(meta: PaymentMeta) {
  const title = `Привилегия ${donateTitles[meta.paymentValue as keyof typeof donateTitles]} для ${meta.nickname}`
  const imageUrl = getPublicUrl("static", donateIcons[meta.paymentValue as keyof typeof donateIcons]);

  return { title, imageUrl }
}

function processWalletPayment(meta: PaymentMeta) {
  const title = `Валюта ${donateTitles[meta.paymentType as keyof typeof donateTitles]} в количестве ${meta.paymentValue} для ${meta.nickname}`
  const imageUrl = getPublicUrl("static", donateIcons[meta.paymentType as keyof typeof donateIcons])

  return { title, imageUrl }
}

async function getUserPurchases(nickname: string) {
  const [fiatPayments, cryptoPayments] = await Promise.all([
    getFiatPayments(nickname),
    getCryptoPayments(nickname),
  ]);

  const merged = [...fiatPayments, ...cryptoPayments];

  return merged.map(p => {
    const status = p.status as PaymentStatus | PaymentCryptoTonStatus

    let title: string = "Unknown";
    let imageUrl: string | null = null;

    switch (p.payment_type) {
      case "donate":
        const donatePayment = processDonatePayment({
          paymentType: p.payment_type, paymentValue: p.payment_value, nickname
        })

        title = donatePayment.title;
        imageUrl = donatePayment.imageUrl;

        break;
      case "belkoin":
      case "charism":
        const walletPayment = processWalletPayment({
          paymentType: p.payment_type, paymentValue: p.payment_value, nickname
        })

        title = walletPayment.title;
        imageUrl = walletPayment.imageUrl;

        break;
    }

    return {
      ...p,
      imageUrl, title, status,
      created_at: p.created_at!,
    }
  })
}

export const getUserPurchasesRoute = new Hono()
  .get("/get-user-purchases", async (ctx) => {
    const nickname = getNickname()

    try {
      const payments = await getUserPurchases(nickname)

      return ctx.json({ data: payments }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })