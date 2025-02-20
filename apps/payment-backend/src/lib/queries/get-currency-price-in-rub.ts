import { coinAPI } from '#shared/api/coin-api.ts';
import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { PAYMENT_CURRENCIES_MAPPING } from '@repo/shared/constants/currencies.ts';

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
    throw new Error(throwError(e))
  }
}