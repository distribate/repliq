import { payments  } from 'payment-backend/src';
import { hc } from 'hono/client';

export const paymentsClient = hc<typeof payments>("http://localhost:3700/api/payment")