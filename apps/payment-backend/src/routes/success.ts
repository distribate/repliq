import { paymentsDB } from "#shared/database/auth-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

const paymentSuccessSchema = z.object({
  id: z.string()
})

async function getPaymentData(id: string) {
  return await paymentsDB
  .selectFrom("payments")
  .select(["nickname", "id"])
  .where("orderid", "=", id)
  .executeTakeFirst()
}

export const paymentSuccessRoute = new Hono()
  .get("/success", zValidator('query', paymentSuccessSchema), async (ctx) => {
    const query = ctx.req.query()
    const { id } = paymentSuccessSchema.parse(query)

    try {
      const payment = await getPaymentData(id)

      if (!payment || !payment.id) {
        return ctx.json({ error: "Payment not found" }, 404)
      }

      const url = `https://fasberry.su?type=payment&id=${payment.id}&nickname=${payment.nickname}`

      return ctx.redirect(url)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })