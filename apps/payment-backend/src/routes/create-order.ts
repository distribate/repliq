import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { getDonateDetails } from '#lib/queries/get-donate-details.ts';
import { ARC_API } from '#shared/api.ts';
import { callAlert } from '#utils/rcon-server/call-alert.ts';

export const donateSchema = z.enum([ 'authentic', 'arkhont', 'loyal' ]);
export const currencySchema = z.enum([ 'TON', 'RUB', 'USDT', 'UAH' ])
export const statusSchema = z.enum(["created", "received", "captured", "cancelled", "failed"])

export const createOrderBodySchema = z.object({
  nickname: z.string().min(1).max(16),
  email: z.string().email('Введите корректный адрес электронной почты'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Введите корректный номер телефона'),
  privacy: z.boolean(),
}).extend({
  currency: currencySchema,
  donate: donateSchema,
});

export type PaymentDonateType = z.infer<typeof donateSchema>
export type PaymentCurrency = z.infer<typeof currencySchema>
export type PaymentResponseStatus = z.infer<typeof statusSchema>

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
  donate: string
}

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
  donate: Pick<z.infer<typeof createOrderBodySchema>, 'donate'>['donate'],
  currency: 'TON' | 'USDT'
}

const cryptoReceived = [ 'TON', 'USDT' ];
const fiatReceived = [ 'RUB' ];

async function createCryptoOrder({
  nickname, donate, orderId, currency,
}: CreateCryptoOrder) {
  const donateDetails = await getDonateDetails({ origin: donate });
  const {
    title, price, imageUrl, description, id: itemId, origin,
  } = donateDetails;
  
  const paymentTitle = `Покупка привилегии ${title} за ${price} ${currency}`;
  
  const paymentDetails: Payment = {
    title: paymentTitle,
    orderId, currency,
    items: [ { title, imageUrl, description, itemId, count: 1, price: 1 } ],
    captured: false,
    meta: { nickname, donate: origin },
  };
  
  try {
    const res = await ARC_API.post('order', { json: paymentDetails });
    
    if (!res.ok) {
      throw new Error('Failed while creating order');
    }
    
    await callAlert(`Игрок ${nickname} купил привилегию ${title}`);
    return await res.json<PaymentResponse>();
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
  
  const { donate, currency, email, privacy, phone, nickname } = result.data;
  
  if (!privacy) {
    return c.json({ error: 'Privacy must required' }, 401);
  }
  
  const orderId = nanoid(16);
  
  if (cryptoReceived.includes(currency)) {
    try {
      const payment = await createCryptoOrder({
        nickname, orderId, donate,
        currency: currency as 'TON' | 'USDT',
      });
      
      return c.json(payment, 200);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Internal Server Error';
      return c.json({ error }, 400);
    }
  } else if (fiatReceived.includes(currency)) {
    //
  }
  
  return c.json(200);
});