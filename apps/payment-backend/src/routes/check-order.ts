import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createPaymentInfo } from '#lib/queries/create-payment-info.ts';
import { updatePaymentInfo } from '#lib/queries/update-payment-info.ts';
import { updateDonateForPlayer } from '#lib/queries/update-donate-for-player.ts';
import {
  checkOrderBodySchema,
  type PaymentCompleted,
} from '@repo/types/schemas/payment/payment-schema.ts';
import { getDonateDetails } from '#lib/queries/get-donate-details.ts';
import { createPaymentPub } from '#lib/publishers/create-payment-pub.ts';
import type { PaymentDonateType } from '@repo/types/entities/payment-types.ts';
import * as crypto from 'node:crypto';

type PaymentOrderId = Pick<PaymentCompleted, 'data'>['data']['orderId']

async function cancelPayment(orderId: PaymentOrderId) {
  return await updatePaymentInfo({ orderId, updateable: { status: 'cancelled' } });
}

async function failedPayment(orderId: PaymentOrderId) {
  return await updatePaymentInfo({ orderId, updateable: { status: 'failed' } });
}

async function capturePayment(orderId: PaymentOrderId) {
  return await updatePaymentInfo({ orderId, updateable: { status: 'captured' } });
}

async function createPayment(data: PaymentCompleted['data']) {
  const { amount: price, status, customer, currency, orderId: orderid, meta, txn, captured } = data;
  const { paymentValue, paymentType, nickname } = meta;
  const { lt, hash } = txn;
  const { wallet } = customer;
  
  switch(paymentType) {
    case 'donate':
      const donateDetails = await getDonateDetails({
        origin: paymentValue as PaymentDonateType,
      });
      
      const { origin: donate } = donateDetails;
      
      return await createPaymentInfo({
        currency, nickname, captured, lt,
        hash, status, price, orderid, wallet, payment_type: paymentType, payment_value: donate
      });
    case 'item':
      break;
    case 'charism':
      break;
    case 'belkoin':
      
      break;
  }
}

async function receivePayment(data: PaymentCompleted['data']) {
  const { orderId, meta } = data;
  const { paymentValue, paymentType, nickname } = meta;
  
  switch (paymentType) {
    case "donate":
      const donateDetails = await getDonateDetails({
        origin: paymentValue as PaymentDonateType
      });
      
      const { origin: donateOrigin } = donateDetails;
      
      await Promise.all([
        updatePaymentInfo({ orderId, updateable: { status: 'received' } }),
        updateDonateForPlayer({ donate: donateOrigin, nickname }),
      ]);
      
      return await createPaymentPub(data);
    case "belkoin":
      
      break;
    case "charism":
      
      break;
    case "item":
      break;
  }
}

export const checkOrderRoute = new Hono()
.post('/check-order', async(c) => {
  const payload = await c.req.text()
  const privateKey = process.env.ARC_PAY_PRIVATE_KEY
  const signature = c.req.header("x-signature")

  if (!signature) {
    throw new HTTPException(401, { message: "Signature required" })
  }
  
  const expectedSignature = new Bun
  .CryptoHasher('sha256', privateKey)
  .update(payload)
  .digest('hex');
  
  if (
    !crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  ) {
    throw new HTTPException(401, { message: 'Invalid signature' });
  }
  
  const body = JSON.parse(await c.req.text())
  
  if (!body) {
    throw new HTTPException(401, { message: 'Body required' });
  }
  
  const result = checkOrderBodySchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ error: result.error }, 400);
  }
  
  const { data } = result.data;
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
        await failedPayment(orderId);
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