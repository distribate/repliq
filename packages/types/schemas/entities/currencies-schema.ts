import { z } from "zod";

export const currencyCryptoSchema = z.enum(['TON', 'USDT(TON)', 'USDT(TRC20)', 'LLAMA', 'GRAM', "BTC", "ETH"]);

export const currencyFiatSchema = z.enum(['RUB']);

export const otherCurrencySchema = z.enum(["BTC", "ETH", "USDT(TRC20)"])

export const arcCurrencySchema = z.enum(["TON", "USDT(TON)"])
// "LLAMA", "GRAM"