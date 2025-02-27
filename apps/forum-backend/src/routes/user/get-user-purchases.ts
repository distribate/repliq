import { paymentsDB } from "#shared/database/payments-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import type { PaymentCryptoTonStatus, PaymentStatus } from "@repo/types/db/payments-database-types";
import { Hono } from "hono";

const donateIcons: Record<"authentic" | "loyal" | "arkhont" | "belkoin" | "charism", string> = {
  "authentic": "donates/authentic_icon.webp",
  "loyal": "donates/loyal_icon.webp",
  "arkhont": "donates/arkhont_icon.webp",
  "belkoin": "donates/belkoin_wallet.png",
  "charism": "donates/charism_wallet.png",
}

const donateMap: Record<"authentic" | "loyal" | "arkhont" | "belkoin" | "charism", string> = {
  "authentic": "Аутентик",
  "loyal": "Лоял",
  "arkhont": "Архонт",
  "belkoin": "Белкоин",
  "charism": "Харизма",
}

async function getUserPurchases(nickname: string) {
  const [fiatPayments, cryptoPayments] = await Promise.all([
    paymentsDB
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
      .execute().then(p => p.map(p => ({ ...p, currency: "RUB" }))),
    paymentsDB
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
      .execute(),
  ]);

  if (!fiatPayments && !cryptoPayments) return null;

  return [...fiatPayments, ...cryptoPayments].map(p => {
    const status = p.status as PaymentStatus | PaymentCryptoTonStatus

    let title: string = "Unknown";
    let imageUrl: string | null = null;

    switch (p.payment_type) {
      case "donate":
        title = `Привилегия ${donateMap[p.payment_value as keyof typeof donateMap]} для ${nickname}`

        imageUrl = getPublicUrl("static", donateIcons[p.payment_value as keyof typeof donateIcons]);

        break;
      case "belkoin":
      case "charism":
        title = `Валюта ${donateMap[p.payment_type as keyof typeof donateMap]} в количестве ${p.payment_value} для ${nickname}`

        imageUrl = getPublicUrl("static", donateIcons[p.payment_type as keyof typeof donateIcons]);

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