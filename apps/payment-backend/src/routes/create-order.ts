import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { nanoid } from 'nanoid';
import { createOrderBodySchema } from '@repo/types/schemas/payment/payment-schema.ts';
import { type PaymentMeta, type PaymentResponse } from '@repo/types/entities/payment-types.ts';
import { getNatsConnection } from '@repo/config-nats/nats-client';
import { throwError } from '@repo/lib/helpers/throw-error';
import { currencyCryptoSchema, currencyFiatSchema } from '@repo/types/schemas/entities/currencies-schema';

export type CreateFiatOrder = PaymentMeta & {
  currency: z.infer<typeof currencyFiatSchema>
}

export type CreateCryptoOrder = PaymentMeta & {
  currency: z.infer<typeof currencyCryptoSchema>
}

const tonCurrencies = ['USDT(TON)', 'TON', 'LLAMA', 'GRAM'] as const;
const tronCurrencies = ['USDT(TRC20)'] as const;
const otherCurrenies = ["BTC", "ETH"] as const

const isTonCurrency = (currency: string): currency is typeof tonCurrencies[number] =>  tonCurrencies.includes(currency as any);

const isTronCurrency = (currency: string): currency is typeof tronCurrencies[number] => tronCurrencies.includes(currency as any);

const isOtherCurrency = (currency: string): currency is typeof otherCurrenies[number] =>  otherCurrenies.includes(currency as any)

async function createFiatOrder({
  paymentValue, paymentType, nickname,
}: Omit<CreateFiatOrder, "currency">) {
  const nc = getNatsConnection()

  const payload = JSON.stringify({
    metadata: { nickname, paymentType, paymentValue },
  })

  let res = await nc.request("payment.start.fiat", payload)

  return res.json<{ errorcode: number | null, errormessage: string | null, data: string | null }>()
}

async function createCryptoOrder({
  nickname, paymentType, paymentValue, currency,
}: CreateCryptoOrder): Promise<PaymentResponse | undefined> {
  const orderId = nanoid(16);
  const orderValues = { nickname, paymentValue, orderId, currency };

  try {
    switch (paymentType) {
      case 'donate':
        // TON network
        // if (isTonCurrency(currency)) {
        //   return await createDonateOrder({ ...orderValues, currency });
        // }

        // TRON network
        // if (isTronCurrency(currency)) {
        //   return await createDonateOrder({ ...orderValues, currency });
        // }

        // Other network
        // if (isOtherCurrency(currency)) {
        //   return await createDonateOrder({ ...orderValues, currency })
        // }
        break;
      case 'belkoin':

        return;
      case 'charism':

        return;
    }
  } catch (e) {
    throw e;
  }
}

export const createOrderRoute = new Hono()
  .post('/create-order', zValidator('json', createOrderBodySchema), async (ctx) => {
    const body = await ctx.req.json()
    const result = createOrderBodySchema.parse(body);

    const { paymentValue, paymentType, currency, nickname } = result;
    const { success: isCrypto, data: cryptoCurrency } = currencyCryptoSchema.safeParse(currency);
    const { success: isFiat, data: fiatCurrency } = currencyFiatSchema.safeParse(currency);

    try {
      if (isCrypto) {
        const payment = await createCryptoOrder({
          nickname, paymentValue, paymentType, currency: cryptoCurrency,
        });

        if (!payment || !payment.paymentUrl) {
          return ctx.json({ error: "Error creating payment" }, 400)
        }

        return ctx.json({ data: payment.paymentUrl }, 200)
      }

      if (isFiat) {
        const { data, errorcode, errormessage } = await createFiatOrder({
          nickname, paymentValue, paymentType,
        })

        if (errorcode || errormessage) {
          return ctx.json({ error: errormessage }, 400);
        }

        return ctx.json({ data }, 200)
      }

      return ctx.json({ error: "Error creating payment" }, 400)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  });