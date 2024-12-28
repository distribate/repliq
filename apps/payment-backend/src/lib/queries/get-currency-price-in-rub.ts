import ky from 'ky';
import type { PAYMENT_CURRENCIES_MAPPING } from '../../shared/currencies.ts';

const coinAPI = ky.extend({
  prefixUrl: "https://api.coingecko.com/api/v3/simple/"
})

type CurrencyString = typeof PAYMENT_CURRENCIES_MAPPING[keyof typeof PAYMENT_CURRENCIES_MAPPING];

export async function getCurrencyPriceInRub<T extends CurrencyString>(convertedCurrency: T): Promise<{
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