import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  paymentMetaSchema,
} from '@repo/types/schemas/payment/payment-schema.ts';
import type { InvoiceType } from '../../types/payment-types.ts';
import { validateSignatureCryptoPay } from '#lib/validators/validate-signature.ts';
import { paymentsDB } from '#shared/database/payments-db.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { publishPaymentSuccess } from '#publishers/pub-payment-success.ts';
import { publishPaymentLog } from '#publishers/pub-payment-log.ts';

type CheckOrderBody = {
  update_id: number,
  payload: InvoiceType,
  request_date: string,
  update_type: string
}

export const checkOrderRoute = new Hono()
  .post('/check-order', async (ctx) => {
    const text = await ctx.req.text()
    const body = await ctx.req.json<CheckOrderBody>()

    const signature = ctx.req.header('crypto-pay-api-signature');

    if (!signature || !text) {
      throw new HTTPException(401, { message: 'Signature or body is required' });
    }

    const isValid = validateSignatureCryptoPay(text, signature);

    if (!isValid) {
      throw new HTTPException(400, { message: 'Invalid signature' })
    }

    try {
      const { update_type, payload } = body;

      if (payload.status === 'expired') {
        await paymentsDB
          .updateTable("payments_crypto")
          .set({ status: "cancelled" })
          .where("orderid", "=", payload.hash)
          .executeTakeFirstOrThrow()
      }

      if (update_type === 'invoice_paid') {
        const meta = paymentMetaSchema.parse(
          JSON.parse(payload.payload ? payload.payload : "")
        )

        publishPaymentSuccess(meta)
        publishPaymentLog({ ...meta, orderId: payload.hash })

        await paymentsDB
          .updateTable("payments_crypto")
          .set({ status: "received" })
          .where("orderid", "=", payload.hash)
          .executeTakeFirstOrThrow()
      }

      return ctx.json({ ok: true }, 200)
    } catch (e) {
      console.error(e)
      return ctx.json({ error: throwError(e) }, 500)
    }
  });