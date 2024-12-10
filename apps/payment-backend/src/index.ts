import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { createOrderRoute } from '#routes/create-order.ts';
import { checkOrderRoute } from '#routes/check-order.ts';
import { stopNatsClient } from '#shared/nats-client.ts';
import { hc } from 'hono/client';

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

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

await startNatsClient()

export const payments = new Hono()
.route('/', createOrderRoute);

const hooks = new Hono()
.route('/', checkOrderRoute);

const app = new Hono()
.basePath('/api')
.route('/payment', payments)
.route('/hooks', hooks);

showRoutes(app, { verbose: false });

export const paymentsClient = hc<typeof payments>("http://localhost:3700/api", { headers })

export default { port: process.env.PAYMENT_BACKEND_PORT, fetch: app.fetch };