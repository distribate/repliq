import { paymentsDB } from "#shared/database/payments-db.ts"

type GetPaymentData = {
  orderId: string,
  type: "crypto" | "fiat"
}

export async function getPaymentData({ orderId, type }: GetPaymentData) {
  switch (type) {
    case "fiat":
      return paymentsDB
        .selectFrom("payments_fiat")
        .select(["created_at", "payment_type", "payment_value", "nickname", "orderid", "status"])
        .where("orderid", "=", orderId)
        .executeTakeFirst()
    case "crypto":
      return paymentsDB
        .selectFrom("payments_crypto")
        .select(["created_at", "payment_type", "payment_value", "nickname", "orderid", "status"])
        .where("orderid", "=", orderId)
        .executeTakeFirst()
    default:
      return null
  }
}