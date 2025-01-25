import { z } from 'zod';
import { donateSchema } from '../entities/donate-schema';
import { currencyCryptoSchema, currencyFiatSchema } from '../entities/currencies-schema';

export const paymentTypeSchema = z.enum(['donate', 'belkoin', 'charism', 'item', 'event']);
export const paymentCurrencySchema = z.union([currencyFiatSchema, currencyCryptoSchema]);
export const paymentStatusSchema = z.enum(['created', 'received', 'captured', 'cancelled', 'failed']);
export const paymentValueSchema = z.union([donateSchema, z.number(), z.string()]);
export const paymentMetaSchema = z.object({
  nickname: z.string().min(1, { message: "Никнейм должен содержать хотя бы 1 символ" }).max(32, { message: "Превышена максимальная длина никнейма" }),
  paymentType: paymentTypeSchema,
  paymentValue: paymentValueSchema,
})

export function paymentTypeValidator({ data, ctx }: { data: any, ctx: z.RefinementCtx }) {
  if (data.paymentType === 'donate' && !donateSchema.safeParse(data.paymentValue, ctx).success) {
    ctx.addIssue({
      code: "custom",
      message: `Invalid donate value. Needed: ${donateSchema.options.join(", ")}`
    })
  }

  if ([paymentTypeSchema.options].includes(data.paymentType) && typeof data.paymentValue !== "number") {
    ctx.addIssue({
      code: "custom",
      message: "Invalid payment value. Needed a number"
    })
  }
}

export const createOrderBodySchema = z.object({
  // email: z.string().email('Введите корректный адрес электронной почты'),
  privacy: z.boolean()
    .refine((value) => value === true, {
      message: 'Вы должны ознакомиться с правилами!',
    }),
  currency: paymentCurrencySchema,
}).merge(paymentMetaSchema).superRefine((data, ctx) => paymentTypeValidator({ data, ctx }))

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
    status: paymentStatusSchema,
    currency: paymentCurrencySchema,
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