import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { ARC_API } from '#shared/api.ts';
import {
  currencyCryptoSchema, currencyFiatSchema,
  currencySchema,
  paymentTypeSchema,
  paymentValueSchema,
} from '@repo/types/schemas/payment/payment-schema.ts';
import {
  type Payment,
  type PaymentDonateType,
  type PaymentResponseStatus,
  type PaymentType,
  type PaymentValueType,
} from '@repo/types/entities/payment-types.ts';
import { getDonateDetails } from '#lib/queries/get-donate-details.ts';

export const createOrderBodySchema = z.object({
  nickname: z.string().min(1).max(16),
  email: z.string().email('Введите корректный адрес электронной почты'),
  privacy: z.boolean(),
}).extend({
  currency: currencySchema,
  paymentType: paymentTypeSchema,
  paymentValue: paymentValueSchema,
});

type PaymentResponse = Payment & {
  status: PaymentResponseStatus,
  createdAt: string,
  amount: number,
  paymentUrl: string,
  testnet: boolean,
  customer: {
    wallet: null | string,
  },
  txn: null
}

type CreateCryptoOrder = {
  nickname: string,
  orderId: string,
  paymentType: PaymentType,
  paymentValue: PaymentValueType
  currency: z.infer<typeof currencyCryptoSchema>
}

type CreateDonateOrder = Omit<CreateCryptoOrder, "paymentType">

type ArcPaymentCurrency = "TON" | "GRAM" | "LLAMA" | "USDT"

type ArcPayment = Omit<Payment, "currency"> & {
  currency: ArcPaymentCurrency
}

async function createDonateOrder({
  currency, orderId, paymentValue, nickname
}: CreateDonateOrder) {
  const donateDetails = await getDonateDetails({
    origin: paymentValue as PaymentDonateType,
  });
  
  const { title, price, imageUrl, description, id: itemId, origin } = donateDetails;
  
  const paymentTitle = `Покупка привилегии ${title} за ${price} ${currency}`;
  
  const paymentItem = {
    title, imageUrl, description, itemId,
    count: 1,
    price: Number(price),
  }
  
  let arcCurrency: ArcPaymentCurrency | null = null;
  
  if (currency === 'USDT(TON)' || currency === 'USDT(TRC20)') {
    arcCurrency = 'USDT';
  } else {
    arcCurrency = currency
  }
  
  if (!arcCurrency) {
    throw new Error("Invalid currency. Available: TON, USDT, GRAM, LLAMA")
  }
  
  const paymentDetails: ArcPayment = {
    title: paymentTitle,
    orderId,
    currency: arcCurrency,
    items: [ paymentItem ],
    captured: false,
    meta: { nickname, paymentType: 'donate', paymentValue: origin },
  };
  
  return await ARC_API.post('order', { json: paymentDetails }).json<PaymentResponse>();
}

async function createCryptoOrder({
  nickname, paymentType, paymentValue, orderId, currency,
}: CreateCryptoOrder) {
  const orderValues = { nickname, paymentValue, orderId, currency }
  
  try {
    switch(paymentType) {
      case 'donate':
        // TON network
        if (currency !== 'USDT(TRC20)') {
          console.log(orderValues.currency);
          return await createDonateOrder(orderValues)
        }
        
        // TRON network
        console.log(orderValues.currency);
        break;
      case "belkoin":
        console.log(orderValues.paymentValue)
        return;
      case "charism":
        console.log(orderValues.paymentValue)
        return;
      case "item":
        console.log(orderValues.paymentValue)
        return;
    }
  } catch (e) {
    throw e;
  }
}

export const createOrderRoute = new Hono()
.post('/create-order', zValidator('json', createOrderBodySchema), async(c) => {
  const result = createOrderBodySchema.safeParse(await c.req.json());
  
  if (!result.success) {
    throw new HTTPException(400, { message: 'Invalid body' });
  }
  
  const { paymentValue, paymentType, currency, privacy, nickname } = result.data;
  
  if (!privacy) {
    return c.json({ error: 'Privacy must required' }, 401);
  }
  
  const orderId = nanoid(16);
  
  const isCrypto = currencyCryptoSchema.safeParse(currency);
  const isFiat = currencyFiatSchema.safeParse(currency);
  
  try {
    if (isCrypto.success) {
      const payment = await createCryptoOrder({
        nickname, orderId, paymentValue, paymentType, currency: isCrypto.data,
      });
      
      return c.json(payment, 200);
    } else if (isFiat.success) {
    
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Internal Server Error';
    return c.json({ error }, 400);
  }
});