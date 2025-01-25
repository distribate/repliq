import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { createOrderRoute } from './routes/create-order.ts';
import { checkOrderRoute } from './routes/check-order.ts';
import { bearerAuth } from 'hono/bearer-auth';
import { initNats } from '@repo/config-nats/nats-client.ts';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { originList } from "@repo/shared/constants/origin-list.ts";
import { timeout } from 'hono/timeout';
import { paymentSuccessRoute } from '#routes/success.ts';
import { getOrderRoute } from '#routes/get-order.ts';

await initNats()

const payments = new Hono()
  .use(cors({ origin: originList }))
  .use(csrf({ origin: originList }))
  .use(bearerAuth({ token: Bun.env.SECRET_TOKEN! }))
  .route('/', createOrderRoute)

const hooks = new Hono()
  .use(cors({ origin: originList }))
  .use(csrf({ origin: originList }))
  .use(bearerAuth({ token: Bun.env.SECRET_TOKEN! }))
  .route('/', checkOrderRoute)

const order = new Hono()
  .use(cors({ origin: "*" }))
  .route("/", getOrderRoute)
  .route("/", paymentSuccessRoute)

const app = new Hono()
  .use(timeout(5000))
  .use(logger())
  .basePath('/api/payment')
  .route('/proccessing', payments)
  .route('/hooks', hooks)
  .route("/", order)

export type OrderAppType = typeof order
export type PaymentAppType = typeof payments

showRoutes(app, { verbose: false });

Bun.serve({
  port: Bun.env.PAYMENT_BACKEND_PORT!,
  fetch: app.fetch
});

console.log(Bun.env.PAYMENT_BACKEND_PORT)