import type { 
  PaymentAppType, 
  OrderAppType, 
  CurrenciesAppType 
} from "apps/payment-backend/src/types/routes-types.ts";
import { hc } from "hono/client";
import { isProduction } from "@repo/lib/helpers/is-production";

const baseUrl = isProduction ? `https://api.fasberry.su/payment` : `http://localhost:4103/payment`;

export const ordersClient = hc<OrderAppType>(baseUrl)
export const paymentsClient = hc<PaymentAppType>(`${baseUrl}/proccessing`)
export const currenciesClient = hc<CurrenciesAppType>(`${baseUrl}/currencies`)