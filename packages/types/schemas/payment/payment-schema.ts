import { z } from 'zod';
import { donateSchema } from '../entities/donate-schema';
import { currencyCryptoSchema, currencyFiatSchema } from '../entities/currencies-schema';

export const paymentFiatMethodSchema = z.enum(["creditCard", "sbp"])
export const paymentTypeSchema = z.enum(['donate', 'belkoin', 'charism', 'item', 'event']);
export const paymentCurrencySchema = z.union([currencyFiatSchema, currencyCryptoSchema]);
export const paymentStatusSchema = z.enum(['created', 'received', 'captured', 'cancelled', 'failed']);
export const paymentValueSchema = z.union([donateSchema, z.number(), z.string()]);

export const paymentMetaSchema = z.object({
  nickname: z.string().min(1, 
    { message: "Никнейм должен содержать хотя бы 1 символ" }).max(32, { message: "Превышена максимальная длина никнейма" }),
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

  if (data.currency === 'RUB' && !paymentFiatMethodSchema.safeParse(data.fiatMethod, ctx).success) {
    ctx.addIssue({
      code: "custom",
      message: `Invalid fiat method value. Needed: ${paymentFiatMethodSchema.options.join(", ")}`
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
  fiatMethod: paymentFiatMethodSchema
}).merge(paymentMetaSchema).superRefine((data, ctx) => paymentTypeValidator({ data, ctx }))