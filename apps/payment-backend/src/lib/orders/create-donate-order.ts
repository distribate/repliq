import { createPaymentItem } from '../../utils/create-payment-item.ts';
import { getCurrencyPriceInRub } from '../queries/get-currency-price-in-rub.ts';
import { getDonateDetails } from '../queries/get-donate-details.ts';
import type { CreateCryptoOrder } from '../../routes/create-order.ts';
import { ARC_API } from '../../shared/api/arc-api.ts';
import {
  type Payment,
  type PaymentDonateType,
  type PaymentResponse,
} from '@repo/types/entities/payment-types.ts';
import { arcCurrencySchema, otherCurrencySchema } from '@repo/types/schemas/entities/currencies-schema.ts';
import { PAYMENT_CURRENCIES_MAPPING } from '@repo/shared/constants/currencies.ts';

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
}: CreateDonateOrder & { orderId: string }) {
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
  
  const { success: isArcNetwork, data: arcCurrency } = arcCurrencySchema.safeParse(currency)
  const {success: isOtherNetwork, data: otherCurrency} = otherCurrencySchema.safeParse(currency)

  if (isArcNetwork) {
    const paymentTitle = `Покупка привилегии ${title} за ${price} ${arcCurrency}`;
    
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
      currency: arcCurrency === 'USDT(TON)' ? "USDT" : arcCurrency,
      items: [ paymentItem ],
      meta: { nickname, paymentType: 'donate', paymentValue: donateOrigin },
    })
    
    return await ARC_API.post('order', { json: paymentDetails }).json<PaymentResponse>();
  }
  
  if (isOtherNetwork) {
    console.log(otherCurrency)
  }
}