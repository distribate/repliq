import { Hono } from 'hono';
import { getBuyerTelegramId } from '#lib/queries/get-buyer-telegram-id.ts';
import { sendTelegramMessageToBuyer } from '#utils/telegram/send-message-to-buyer.ts';
import { HTTPException } from 'hono/http-exception';
import { sendLogs } from '#utils/telegram/send-logs.ts';
import { createPaymentInfo } from '#lib/queries/create-payment-info.ts';
import { updatePaymentInfo } from '#lib/queries/update-payment-info.ts';
import { getDonateDetails } from '#lib/queries/get-donate-details.ts';
import { updateDonateForPlayer } from '#lib/queries/update-donate-for-player.ts';
import { z } from 'zod';
import { currencySchema, donateSchema, statusSchema } from '#routes/create-order.ts';

export type PaymentData = Omit<Pick<PaymentCompleted, 'data'>['data'],
  | 'testnet'
  | 'txn'
  | 'uuid'
  | 'captured'
>

export const checkOrderBodySchema = z.object({
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
    }).extend({
      donate: donateSchema
    }),
    customer: z.object({
      wallet: z.string(),
    })
  }).extend({
    status: statusSchema,
    currency: currencySchema
  }),
});

type PaymentCompleted = z.infer<typeof checkOrderBodySchema>
type PaymentOrderId = Pick<PaymentCompleted, "data">["data"]["orderId"]

async function cancelPayment(orderId: PaymentOrderId) {
  return await updatePaymentInfo({
    orderId, updateable: { status: 'cancelled' },
  });
}

async function updatePayment(orderId: PaymentOrderId) {
  return await updatePaymentInfo({
    orderId, updateable: { status: 'failed' },
  });
}

async function capturePayment(orderId: PaymentOrderId) {
  return await updatePaymentInfo({
    orderId, updateable: { status: 'captured' },
  });
}

async function createPayment(data: PaymentCompleted['data']) {
  const { amount: price, status, customer, currency, orderId: orderid, meta, txn, captured } = data;
  const { donate: donateTitle, nickname } = meta;
  const { lt, hash } = txn;
  const { wallet } = customer;
  
  const donateDetails = await getDonateDetails({ origin: donateTitle });
  const { origin: donate } = donateDetails;
  
  return await createPaymentInfo({
    currency, nickname, captured, lt,
    hash, status, price, orderid, wallet, donate,
  });
}

async function receivePayment(data: PaymentCompleted['data']) {
  const { amount, status, createdAt, customer, orderId, meta, currency } = data;
  const { donate: donateTitle, nickname } = meta;
  
  const donateDetails = await getDonateDetails({ origin: donateTitle });
  const { origin: donateOrigin } = donateDetails;
  
  await Promise.all([
    updatePaymentInfo({ orderId, updateable: { status: 'received' } }),
    updateDonateForPlayer({ donate: donateOrigin, nickname }),
  ]);
  
  const buyerTelegramId = await getBuyerTelegramId(nickname);
  
  await Promise.all([
    sendTelegramMessageToBuyer({
      amount, status, createdAt, customer, currency, orderId,
      meta: {
        nickname, donate: donateTitle,
      },
      telegramId: buyerTelegramId,
    }),
    sendLogs({
      data: {
        amount, status, createdAt, customer, currency, orderId,
        meta: {
          donate: donateDetails.title,
          nickname,
        },
        telegramId: buyerTelegramId ?? null,
      },
      messageType: {
        tag: 'shop',
      },
    }),
  ]);
}

export const checkOrderRoute = new Hono().post('/check-order', async(c) => {
  const body = await c.req.json();
  if (!body) throw new HTTPException(401, { message: 'Body required' });
  
  const result = checkOrderBodySchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ error: result.error }, 400);
  }
  
  const payment = result.data;
  
  const { data } = payment;
  const { orderId, status } = data;
  
  switch(status) {
    case 'received':
      try {
        await receivePayment(data);
        return c.json(200);
      } catch (e) {
        const error = e instanceof Error ? e.message : `Error to receive payment`;
        return c.json({ error }, 400);
      }
    case 'created':
      try {
        await createPayment(data);
        return c.json(200);
      } catch (e) {
        const error = e instanceof Error ? e.message : `Error to create payment`;
        return c.json({ error }, 400);
      }
    case 'cancelled':
      try {
        await cancelPayment(orderId);
        return c.json(200);
      } catch (e) {
        const error = e instanceof Error ? e.message : `Error to cancel payment`;
        return c.json({ error }, 400);
      }
    case 'failed':
      try {
        await updatePayment(orderId);
        return c.json(200);
      } catch (e) {
        const error = e instanceof Error ? e.message : `Error to fail payment`;
        return c.json({ error }, 400);
      }
    case 'captured':
      try {
        await capturePayment(orderId);
        return c.json(200);
      } catch (e) {
        const error = e instanceof Error ? e.message : `Error to capture payment`;
        return c.json({ error }, 400);
      }
  }
});