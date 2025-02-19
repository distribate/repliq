import { paymentsDB } from "#shared/database/payments-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getPaymentData(id: string) {
  return await paymentsDB
    .selectFrom("payments")
    .select(["payments.payment_type", "payment_value", "nickname", "orderid"])
    .where("id", "=", id)
    .executeTakeFirst()
}

export const getOrderRoute = new Hono()
  .get('/get-order/:id', async (ctx) => {
    const { id } = ctx.req.param()

    try {
      const payment = await getPaymentData(id)

      if (!payment) {
        return ctx.json({ error: "Payment not found" }, 404)
      }

      return ctx.json({ data: payment }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })