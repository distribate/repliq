import { z } from 'zod';
import {
  arcCurrencySchema, currencyCryptoSchema,
  currencySchema,
  donateSchema,
  paymentTypeSchema,
  paymentValueSchema,
  statusSchema,
} from '../schemas/payment/payment-schema';

export type PaymentCryptoCurrency = z.infer<typeof currencyCryptoSchema>
export type PaymentArcCurrency = z.infer<typeof arcCurrencySchema>
export type PaymentDonateType = z.infer<typeof donateSchema>
export type PaymentCurrency = z.infer<typeof currencySchema>
export type PaymentResponseStatus = z.infer<typeof statusSchema>
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