import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { createOrderRoute } from './routes/create-order.ts';
import { stopNatsClient } from './shared/nats-client.ts';
import { checkOrderRoute } from './routes/check-order.ts';
import { bearerAuth } from 'hono/bearer-auth';

const token = process.env.SECRET_TOKEN!

async function startNatsClient() {
  try {
    process.on('SIGINT', async () => {
      console.log("Graceful shutdown initiated...");
      await stopNatsClient();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log("Graceful shutdown initiated...");
      await stopNatsClient();
      process.exit(0);
    });
  } catch (e) {
    console.error(e)
    await stopNatsClient();
    process.exit(1)
  }
}

startNatsClient()

export const payments = new Hono()
.route('/', createOrderRoute);

const hooks = new Hono()
.route('/', checkOrderRoute);

const app = new Hono()
.use('*', logger())
.use("*", bearerAuth({ token }))
.basePath('/api')
.route('/payment', payments)
.route('/hooks', hooks);

showRoutes(app, { verbose: false });

export type PaymentAppType = typeof app

export default { port: process.env.PAYMENT_BACKEND_PORT, fetch: app.fetch };