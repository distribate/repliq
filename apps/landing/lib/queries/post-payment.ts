'use server';

import ky, { HTTPError } from 'ky';
import { z, ZodError } from 'zod';
import { createOrderBodySchema } from '@repo/types/schemas/payment/payment-schema.ts';
import { PaymentResponse } from '@repo/types/entities/payment-types.ts';
import { parseZodErrorMessages } from '@repo/lib/helpers/parse-zod-errors.ts';

const api = ky.extend({
  prefixUrl: 'http://localhost:3700/api/payment'
})

export async function postPayment(
  payment: z.infer<typeof createOrderBodySchema>
): Promise<PaymentResponse | string[]> {
  try {
    return await api.post('create-order', { json: payment }).json<PaymentResponse>();
  } catch (e) {
    if (e instanceof HTTPError) {
      if (e instanceof ZodError) {
        const errorBody = await e.response.json<ZodError>();
        // @ts-ignore
        return parseZodErrorMessages(errorBody.error); // instead errors -> error (in zodValidator)
      }
      
      const { error } = await e.response.json<{ error: string }>()
      console.error(error)
      return [error];
    }
    
    throw e;
  }
}