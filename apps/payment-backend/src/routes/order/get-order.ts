import { getPaymentData } from "#lib/queries/get-payment-data.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import type { PaymentCryptoTonStatus, PaymentStatus } from "@repo/types/db/payments-database-types";
import { Hono } from "hono";
import { z } from "zod/v4";

const getOrderRouteSchema = z.object({
  type: z.enum(["crypto", "fiat"])
})

const statusMap: Record<PaymentCryptoTonStatus | PaymentStatus, "success" | "pending" | "canceled" | "error"> = {
  "succeeded": "success",
  "failed": "error",
  "captured": "pending",
  "pending": "pending",
  "waitingForCapture": "pending",
  "canceled": "canceled",
  "received": "success",
  "created": "pending",
  "cancelled": "canceled",
}

export const getOrderRoute = new Hono()
  .get('/get-order/:id', zValidator('query', getOrderRouteSchema), async (ctx) => {
    const { id } = ctx.req.param()
    const { type } = getOrderRouteSchema.parse(ctx.req.query())

    try {
      const res = await getPaymentData({
        orderId: id, type
      })

      if (!res) {
        return ctx.json({ error: "Payment not found" }, 404)
      }

      const isExpired = res.created_at! <= new Date(Date.now() - 10 * 60 * 1000);

      const payment = {
        ...res,
        status: isExpired ? "canceled" : statusMap[res.status]
      }

      return ctx.json({ data: payment }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })