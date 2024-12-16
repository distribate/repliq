import { getDonateDetails } from '#lib/queries/get-donate-details.ts';
import {
  type Payment,
  type PaymentDonateType,
  type PaymentResponse,
} from '@repo/types/entities/payment-types.ts';
import { ARC_API } from '#shared/api.ts';
import type { CreateCryptoOrder } from '#routes/create-order.ts';
import {
  arcCurrencySchema,
  otherCurrencySchema,
} from '@repo/types/schemas/payment/payment-schema.ts';
import { getCurrencyPriceInRub } from '#lib/queries/get-currency-price-in-rub.ts';
import { PAYMENT_CURRENCIES_MAPPING } from '#shared/currencies.ts';
import { createPaymentItem } from '#helpers/create-payment-item.ts';

type CreateDonateOrder = Omit<CreateCryptoOrder, 'paymentType'>

type ArcPayment = Omit<Payment, 'currency'> & {
  currency:
    | "TON"
    | "USDT"
    // | "GRAM"
    // | "LLAMA"
}

function getPriceByCurrency(priceByCurrency: number, priceByRub: number): number {
  const r = (priceByRub / priceByCurrency).toFixed(3)
  return Number(r)
}

export async function createDonateOrder({
  currency, orderId, paymentValue, nickname,
}: CreateDonateOrder) {
  const currencyId = PAYMENT_CURRENCIES_MAPPING[currency];
  
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