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
import { checkOrderFiatRoute } from '#routes/check-order-fiat.ts';

const token = process.env.SECRET_TOKEN!
const port = process.env.PAYMENT_BACKEND_PORT

await initNats()

const payments = new Hono()
  .route('/', createOrderRoute)

const hooks = new Hono()
  .route('/', checkOrderRoute)
  .route("/", checkOrderFiatRoute)

const app = new Hono()
  .use(cors({ origin: originList }))
  .use(csrf({ origin: originList }))
  .use(timeout(5000))
  .use(bearerAuth({ token }))
  .use(logger())
  .basePath('/api/payment')
  .route('/proccessing', payments)
  .route('/hooks', hooks);

export type PaymentAppType = typeof payments

async function createServer() {
  showRoutes(app, { verbose: false });

  Bun.serve({ port, fetch: app.fetch });
}

createServer().then((_) => console.log(port))