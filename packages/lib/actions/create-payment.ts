import { HTTPError } from 'ky';
import { z, ZodError } from 'zod';
import { createOrderBodySchema } from '@repo/types/schemas/payment/payment-schema.ts';
import { parseZodErrorMessages } from '@repo/lib/helpers/parse-zod-errors.ts';
import { paymentsClient } from '@repo/shared/api/payments-client.ts';

export async function createPayment(payment: z.infer<typeof createOrderBodySchema>) {
  try {
    const res = await paymentsClient["create-order"].$post({
      json: payment
    })

    const data = await res.json()

    if ("error" in data) {
      return { error: data.error }
    }

    return data
  } catch (e) {
    if (e instanceof HTTPError) {
      if (e instanceof ZodError) {
        const errorBody = await e.response.json<{ error: ZodError }>();

        return { error: parseZodErrorMessages(errorBody.error).join(", ") }
      }

      const { error } = await e.response.json<{ error: string }>();

      return { error }
    }

    throw e;
  }
}