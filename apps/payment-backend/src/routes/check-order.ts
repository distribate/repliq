import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  checkOrderBodySchema,
  type PaymentCompleted,
} from '@repo/types/schemas/payment/payment-schema.ts';
import type { PaymentDonateType } from '@repo/types/entities/payment-types.ts';
import * as crypto from 'node:crypto';
import { updatePaymentInfo } from '../lib/queries/update-payment-info.ts';
import { createPaymentInfo } from '../lib/queries/create-payment-info.ts';
import { getDonateDetails } from '../lib/queries/get-donate-details.ts';
import { updateDonateForPlayer } from '../lib/queries/update-donate-for-player.ts';
import { createPaymentPub } from '../lib/publishers/create-payment-pub.ts';

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
        hash, status, price, orderid, wallet, payment_type: paymentType, payment_value: donate,
      });
    case 'charism':
      break;
    case 'belkoin':
      
      break;
  }
}

async function receivePayment(data: PaymentCompleted['data']) {
  const { orderId, meta } = data;
  const { paymentValue, paymentType, nickname } = meta;
  
  switch(paymentType) {
    case 'donate':
      const donateDetails = await getDonateDetails({
        origin: paymentValue as PaymentDonateType,
      });
      
      const { origin: donateOrigin } = donateDetails;
      
      await Promise.all([
        updatePaymentInfo({ orderId, updateable: { status: 'received' } }),
        updateDonateForPlayer({ donate: donateOrigin, nickname }),
      ]);
      
      return await createPaymentPub(data);
    case 'belkoin':
      
      break;
    case 'charism':
      
      break
  }
}

async function validateSignature(requestedSignature: string, payload: string) {
  const privateKey = process.env.ARC_PAY_PRIVATE_KEY;
  
  const expectedSignature = new Bun
  .CryptoHasher('sha256', privateKey)
  .update(payload)
  .digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(requestedSignature))) {
    throw new HTTPException(401, { message: 'Invalid signature' });
  }
}

export const checkOrderRoute = new Hono()
.post('/check-order', async(c) => {
  const payload = await c.req.text();
  
  if (!payload) {
    throw new HTTPException(400, { message: 'Body required' });
  }
  
  const requestedSignature = c.req.header('x-signature');
  
  if (!requestedSignature) {
    throw new HTTPException(401, { message: 'Signature required' });
  }
  
  try {
    await validateSignature(requestedSignature, payload);
  } catch (e) {
    if (e instanceof HTTPException) {
      return c.json({ error: e.message }, 400);
    }
  }
  
  const body = JSON.parse(payload);
  const { success, error, data: bodyData } = checkOrderBodySchema.safeParse(body);
  
  if (!success) {
    return c.json({ error: error }, 400);
  }
  
  const { data } = bodyData;
  const { orderId, status } = data;
  
  try {
    switch(status) {
      case 'received':
        await receivePayment(data);
        return c.json(200);
      case 'created':
        await createPayment(data);
        return c.json(200);
      case 'cancelled':
        await cancelPayment(orderId);
        return c.json(200);
      case 'failed':
        await failedPayment(orderId);
        return c.json(200);
      case 'captured':
        await capturePayment(orderId);
        return c.json(200);
    }
  } catch (e) {
    const error = e instanceof Error
      ? e.message
      : `Error to capture payment`;
    
    return c.json({ error }, 400);
  }
});