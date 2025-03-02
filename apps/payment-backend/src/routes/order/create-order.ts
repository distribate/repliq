import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createOrderBodySchema } from '@repo/types/schemas/payment/payment-schema.ts';
import { throwError } from '@repo/lib/helpers/throw-error';
import { currencyCryptoSchema, currencyFiatSchema } from '@repo/types/schemas/entities/currencies-schema';
import { validateAvailabilityByCurrency } from '#lib/validators/validate-availability-by-currency.ts';
import { getParamFromUrl } from '#helpers/get-param-from-url.ts';
import { createCryptoOrder } from '#lib/orders/create-crypto-order.ts';
import { createFiatOrder } from '#lib/orders/create-fiat-order.ts';

export const createOrderRoute = new Hono()
  .post('/create-order', zValidator('json', createOrderBodySchema), async (ctx) => {
    const {
      paymentValue, paymentType, currency, nickname, fiatMethod, privacy
    } = createOrderBodySchema.parse(await ctx.req.json());

    if (!privacy) {
      return ctx.json({ error: "You did not agree to the terms" }, 400)
    }

    const isAvailable = await validateAvailabilityByCurrency(currency);

    if (!isAvailable) {
      return ctx.json({ error: "Покупка за эту валюту не доступна" }, 400)
    }

    const { success: isCrypto, data: cryptoCurrency } = currencyCryptoSchema.safeParse(currency);
    const { success: isFiat, data: fiatCurrency } = currencyFiatSchema.safeParse(currency);

    try {
      if (isCrypto) {
        const payment = await createCryptoOrder({
          nickname, paymentValue, paymentType, currency: cryptoCurrency
        });

        if (!payment) {
          return ctx.json({ error: "Error creating payment" }, 400)
        }

        return ctx.json({ data: payment }, 200)
      }

      if (isFiat && fiatCurrency) {
        const { data: url, isSuccess } = await createFiatOrder({
          nickname, paymentValue, paymentType, type: fiatMethod
        })

        if (!isSuccess || !url) {
          return ctx.json({ error: "Error creating payment" }, 400);
        }

        const orderId = getParamFromUrl(url, "orderId");

        if (!orderId) {
          return ctx.json({ error: "Error creating payment" }, 400);
        }

        return ctx.json({ data: { url, orderId } }, 200)
      }

      return ctx.json({ error: "Error creating payment" }, 400)
    } catch (e) {
      console.error(e)
      return ctx.json({ error: throwError(e) }, 500)
    }
  });