import { z } from 'zod';
import {
  paymentCurrencySchema,
  paymentTypeSchema,
  paymentValueSchema,
  paymentStatusSchema,
} from '../schemas/payment/payment-schema.ts';
import type { donateSchema } from './donate-type.ts';
import type { arcCurrencySchema, currencyCryptoSchema } from '../schemas/entities/currencies-schema.ts';

export type PaymentCryptoCurrency = z.infer<typeof currencyCryptoSchema>
export type PaymentArcCurrency = z.infer<typeof arcCurrencySchema>
export type PaymentDonateType = z.infer<typeof donateSchema>
export type PaymentCurrency = z.infer<typeof paymentCurrencySchema>
export type PaymentResponseStatus = z.infer<typeof paymentStatusSchema>
export type PaymentType = z.infer<typeof paymentTypeSchema>
export type PaymentValueType = z.infer<typeof paymentValueSchema>

export type PaymentResponse = Payment & {
  status: PaymentResponseStatus,
  createdAt: string,
  amount: number,
  paymentUrl: string,
  testnet: boolean,
  customer: {
    wallet: null | string,
  },
  txn: {
    hash: string,
    lt: number
  } | null
}

export type PaymentDetail = {
  title: string,
  description: string,
  imageUrl: string,
  price: number,
  count: number,
  itemId: string
}

export type Payment = {
  title: string,
  orderId: string,
  currency: PaymentCurrency,
  items: Array<PaymentDetail>,
  captured: boolean,
  meta: PaymentMeta
}

export type PaymentMeta = {
  nickname: string,
  paymentType: PaymentType,
  paymentValue: PaymentDonateType | string | number
}