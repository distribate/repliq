import type { PaymentAppType } from "payment-backend/src";
import { hc } from "hono/client";
import { isProduction } from "@repo/lib/helpers/is-production";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

const production = `https://api.fasberry.su/api/payment`;

const origin = isProduction ? production : production;

export const paymentsClient = hc<PaymentAppType>(`${origin}/proccessing`, { headers })