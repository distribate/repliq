import { z } from 'zod';
import {
  currencySchema,
  donateSchema,
  paymentTypeSchema,
  paymentValueSchema,
  statusSchema,
} from '../schemas/payment/payment-schema';

export type PaymentDonateType = z.infer<typeof donateSchema>
export type PaymentCurrency = z.infer<typeof currencySchema>
export type PaymentResponseStatus = z.infer<typeof statusSchema>
export type PaymentType = z.infer<typeof paymentTypeSchema>
export type PaymentValueType = z.infer<typeof paymentValueSchema>

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