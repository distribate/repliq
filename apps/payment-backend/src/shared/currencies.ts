import type { PaymentCryptoCurrency } from '@repo/types/entities/payment-types.ts';

export const PAYMENT_CURRENCIES_MAPPING: Record<PaymentCryptoCurrency, string> = {
  "BTC": "bitcoin",
  "ETH": "ethereum",
  'USDT(TRC20)': 'tether',
  'USDT(TON)': 'tether',
  'TON': 'the-open-network',
  'GRAM': 'gram-2',
  'LLAMA': 'llama',
};