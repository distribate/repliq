import type { PaymentAppType } from "payment-backend/src";
import { hc } from "hono/client";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

export const paymentsClient = hc<PaymentAppType>(`http://localhost:4103/api`, { headers })