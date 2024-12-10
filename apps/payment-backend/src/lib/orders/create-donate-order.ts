import { getDonateDetails } from '#lib/queries/get-donate-details.ts';
import {
  type Payment,
  type PaymentCryptoCurrency,
  type PaymentDonateType,
  type PaymentResponse,
} from '@repo/types/entities/payment-types.ts';
import { ARC_API } from '#shared/api.ts';
import type { CreateCryptoOrder } from '#routes/create-order.ts';
import ky from 'ky';
import {
  arcCurrencySchema,
  otherCurrencySchema,
} from '@repo/types/schemas/payment/payment-schema.ts';

type CreateDonateOrder = Omit<CreateCryptoOrder, 'paymentType'>

type ArcPayment = Omit<Payment, 'currency'> & {
  currency:
    | "TON"
    | "USDT"
    // | "GRAM"
    // | "LLAMA"
}

async function createPaymentItem<T>(item: T): Promise<T> {
  return item;
}

const coinAPI = ky.extend({
  prefixUrl: "https://api.coingecko.com/api/v3/simple/"
})

const PaymentCurrencyMapping: Record<PaymentCryptoCurrency, string> = {
  "BTC": "bitcoin",
  "ETH": "ethereum",
  'USDT(TRC20)': 'tether',
  'USDT(TON)': 'tether',
  'TON': 'the-open-network',
  'GRAM': 'gram-2',
  'LLAMA': 'llama',
};

type CurrencyString = typeof PaymentCurrencyMapping[keyof typeof PaymentCurrencyMapping];

async function getCurrencyPriceInRub<T extends CurrencyString>(convertedCurrency: T): Promise<{
  [key in T]: { rub: number }
}> {
  try {
    return await coinAPI.get("price", {
      searchParams: {
        "ids": convertedCurrency,
        "vs_currencies": "rub"
      }
    }).json<{ [key in T]: { rub: number } }>();
  } catch (e) {
    throw e
  }
}

function getPriceByCurrency(priceByCurrency: number, priceByRub: number): number {
  const r = (priceByRub / priceByCurrency).toFixed(3)
  return Number(r)
}

export async function createDonateOrder({
  currency, orderId, paymentValue, nickname,
}: CreateDonateOrder) {
  const currencyId = PaymentCurrencyMapping[currency];
  
  if (!currencyId) {
    throw new Error(`Currency ID for ${currency} not found`);
  }
  
  const [donateDetails, currencyPrice] = await Promise.all([
    getDonateDetails({ origin: paymentValue as PaymentDonateType }),
    getCurrencyPriceInRub(currencyId)
  ])
  
  const { title, price: priceInRUB, imageUrl, description, id, origin: donateOrigin } = donateDetails
  
  const price = getPriceByCurrency(
    currencyPrice[currencyId].rub, Number(priceInRUB)
  )
  
  const isArcNetwork = arcCurrencySchema.safeParse(currency)
  const isOtherNetwork = otherCurrencySchema.safeParse(currency)

  if (isArcNetwork.success) {
    const paymentTitle = `Покупка привилегии ${title} за ${price} ${currency}`;
    
    const paymentItem = {
      title,
      imageUrl,
      description,
      itemId: id,
      count: 1,
      price: Number(price),
    };
    
    const paymentDetails = await createPaymentItem<ArcPayment>({
      title: paymentTitle, captured: false, orderId,
      currency: isArcNetwork.data === 'USDT(TON)' ? "USDT" : isArcNetwork.data,
      items: [ paymentItem ],
      meta: { nickname, paymentType: 'donate', paymentValue: donateOrigin },
    })
    
    return await ARC_API.post('order', { json: paymentDetails }).json<PaymentResponse>();
  }
  
  if (isOtherNetwork.success) {
    console.log(isOtherNetwork.data)
  }
}