import { PaymentCryptoCurrency } from "@repo/types/entities/payment-types";

export const PAYMENT_CURRENCIES_MAPPING: Record<PaymentCryptoCurrency, string> = {
  "BTC": "bitcoin",
  "ETH": "ethereum",
  'USDT': 'tether',
  'TON': 'the-open-network',
  "TRX": "tron",
  "USDC": "usd-coin",
  "BNB": "binancecoin",
  "LTC": "litecoin",
};