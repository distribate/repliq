import { z } from 'zod';

export const currencyCryptoSchema = z.enum([ 'TON', 'USDT(TON)', 'USDT(TRC20)', 'LLAMA', 'GRAM' ]);
export const currencyFiatSchema = z.enum([ 'RUB' ]);
export const paymentTypeSchema = z.enum([ 'donate', 'item', 'belkoin', 'charism' ]);
export const donateSchema = z.enum([ 'authentic', 'arkhont', 'loyal' ]);
export const currencySchema = z.union([ currencyFiatSchema, currencyCryptoSchema ]);
export const statusSchema = z.enum([ 'created', 'received', 'captured', 'cancelled', 'failed' ]);
export const paymentValueSchema = z.union([ donateSchema, z.number(), z.string() ]);

export const responsePaymentSchema = z.object({
  event: z.string(),
  data: z.object({
    uuid: z.string(),
    orderId: z.string(),
    amount: z.number(),
    createdAt: z.string(),
    captured: z.boolean(),
    testnet: z.boolean(),
    txn: z.object({
      hash: z.string(),
      lt: z.number().or(z.string()),
    }),
    meta: z.object({
      nickname: z.string(),
    }),
    customer: z.object({
      wallet: z.string(),
    }),
  }).extend({
    status: statusSchema,
    currency: currencySchema,
  }),
});

export const checkOrderBodySchema = responsePaymentSchema.extend({
  data: responsePaymentSchema.shape.data.extend({
    meta: responsePaymentSchema.shape.data.shape.meta.extend({
      paymentValue: paymentValueSchema,
      paymentType: paymentTypeSchema
    }),
  }),
});

export type PaymentCompleted = z.infer<typeof checkOrderBodySchema>

export type PaymentData = Omit<Pick<PaymentCompleted, 'data'>['data'],
  | 'testnet' | 'txn' | 'uuid' | 'captured'
>