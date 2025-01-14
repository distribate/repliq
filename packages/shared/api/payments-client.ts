import type { PaymentAppType } from "payment-backend/src";
import { hc } from "hono/client";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

const isProduction = process.env.NODE_ENV === "production";

const production = `https://api.fasberry.su/api/payment`;

const origin = isProduction ? production : production;

export const paymentsClient = hc<PaymentAppType>(`${origin}/proccessing`, { headers })