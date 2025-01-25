import type { PaymentAppType, OrderAppType } from "payment-backend/src";
import { hc } from "hono/client";
import { isProduction } from "@repo/lib/helpers/is-production";

const baseUrl = isProduction ? `https://api.fasberry.su/api/payment` : `http://localhost:4103/api/payment`;

export const ordersClient = hc<OrderAppType>(baseUrl)
export const paymentsClient = hc<PaymentAppType>(`${baseUrl}/proccessing`)