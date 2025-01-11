import type { PaymentAppType } from "payment-backend/src";
import { hc } from "hono/client";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

const origin = `https://api.fasberry.su/api/payment`;

export const paymentsClient = hc<PaymentAppType>(`${origin}/proccessing`, { headers })