import { z } from 'zod/v4';
import {
  paymentCurrencySchema,
  paymentTypeSchema,
  paymentValueSchema,
  paymentStatusSchema,
} from '../schemas/payment/payment-schema.ts';
import type { donateSchema } from './donate-type.ts';
import type { currencyCryptoSchema } from '../schemas/entities/currencies-schema.ts';

export type PaymentCryptoCurrency = z.infer<typeof currencyCryptoSchema>
export type PaymentDonateType = z.infer<typeof donateSchema>
export type PaymentCurrency = z.infer<typeof paymentCurrencySchema>
export type PaymentResponseStatus = z.infer<typeof paymentStatusSchema>
export type PaymentType = z.infer<typeof paymentTypeSchema>
export type PaymentValueType = z.infer<typeof paymentValueSchema>

export type PaymentMeta = {
  nickname: string,
  paymentType: PaymentType,
  paymentValue: PaymentDonateType | string | number
}