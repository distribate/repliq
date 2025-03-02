import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { createOrderRoute } from './routes/order/create-order.ts';
import { checkOrderRoute } from './routes/order/check-order.ts';
import { initNats } from '@repo/config-nats/nats-client.ts';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { originList } from "@repo/shared/constants/origin-list.ts";
import { timeout } from 'hono/timeout';
import { getOrderRoute } from '#routes/order/get-order.ts';
import { getCurrenciesRoute } from '#routes/currencies/get-currencies.ts';

await initNats()

export const payments = new Hono()
  .use(cors({ origin: originList }))
  .use(csrf({ origin: originList }))
  .route('/', createOrderRoute)

export const hooks = new Hono()
  .use(cors({ origin: "*" }))
  .route('/', checkOrderRoute)

export const order = new Hono()
  .use(cors({ origin: "*" }))
  .route("/", getOrderRoute)

export const currencies = new Hono()
  .use(cors({ origin: "*" }))
  .route("/", getCurrenciesRoute)

const app = new Hono()
  .basePath('/payment')
  .use(timeout(5000))
  .use(logger())
  .route('/proccessing', payments)
  .route('/hooks', hooks)
  .route('/currencies', currencies)
  .route("/", order)

showRoutes(app, { verbose: false });

Bun.serve({ port: Bun.env.PAYMENT_BACKEND_PORT!, fetch: app.fetch });

console.log(Bun.env.PAYMENT_BACKEND_PORT)