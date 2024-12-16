import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import {
  createOrderBodySchema,
  currencyCryptoSchema, currencyFiatSchema,
} from '@repo/types/schemas/payment/payment-schema.ts';
import {
  type PaymentResponse,
  type PaymentType,
  type PaymentValueType,
} from '@repo/types/entities/payment-types.ts';
import { createDonateOrder } from '#lib/orders/create-donate-order.ts';

export type CreateOrder = {
  nickname: string,
  orderId: string,
  paymentType: PaymentType,
  paymentValue: PaymentValueType
}

export type CreateFiatOrder = CreateOrder & {
  currency: z.infer<typeof currencyFiatSchema>
}

export type CreateCryptoOrder = CreateOrder & {
  currency: z.infer<typeof currencyCryptoSchema>
}

const tonCurrencies = ['USDT(TON)', 'TON', 'LLAMA', 'GRAM'] as const;
const tronCurrencies = ['USDT(TRC20)'] as const;
const otherCurrenies = ["BTC", "ETH"] as const

function isTonCurrency(currency: string): currency is typeof tonCurrencies[number] {
  return tonCurrencies.includes(currency as any);
}

function isTronCurrency(currency: string): currency is typeof tronCurrencies[number] {
  return tronCurrencies.includes(currency as any);
}

function isOtherCurrency(currency: string): currency is typeof otherCurrenies[number] {
  return otherCurrenies.includes(currency as any)
}

async function createFiatOrder({
  currency, orderId, paymentValue, paymentType, nickname,
}: CreateFiatOrder) {
  
  try {
    return {
      ads: 'asd',
    };
  } catch (e) {
    throw e;
  }
}

async function createCryptoOrder({
  nickname, paymentType, paymentValue, orderId, currency,
}: CreateCryptoOrder): Promise<PaymentResponse | undefined> {
  const orderValues = { nickname, paymentValue, orderId, currency };
  
  try {
    switch(paymentType) {
      case 'donate':
        // TON network
        if (isTonCurrency(currency)) {
          return await createDonateOrder({ ...orderValues, currency });
        }
        
        // TRON network
        if (isTronCurrency(currency)) {
          return await createDonateOrder({ ...orderValues, currency });
        }
        
        // Other network
        if (isOtherCurrency(currency)) {
          return await createDonateOrder({ ...orderValues, currency })
        }
        break;
      case 'belkoin':
        
        return;
      case 'charism':
        
        return;
      case 'item':
        
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
  
  const { paymentValue, paymentType, currency, nickname } = result.data;
  
  const orderId = nanoid(16);
  
  const isCrypto = currencyCryptoSchema.safeParse(currency);
  const isFiat = currencyFiatSchema.safeParse(currency);
  
  let paymentUrl: string | null = null
  
  try {
    if (isCrypto.success) {
      const payment = await createCryptoOrder({
        nickname, orderId, paymentValue, paymentType, currency: isCrypto.data,
      });
      
      paymentUrl = payment?.paymentUrl ?? null
    }
    
    if (isFiat.success) {
      return c.json({ error: "Fiat is not allowed" }, 400)
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Internal Server Error';
    return c.json({ error: error }, 400);
  }
  
  if (!paymentUrl) {
    return c.json({ error: "Create payment failed"}, 400)
  }
  
  return c.json({ paymentUrl }, 200);
});