import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { createOrderRoute } from '#routes/create-order.ts';
import { checkOrderRoute } from '#routes/check-order.ts';
import { stopNatsClient } from '#shared/nats-client.ts';

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

const payments = new Hono()
.basePath('/payment')
.route('/', createOrderRoute);

const hooks = new Hono()
.basePath('/hooks')
.route('/', checkOrderRoute);

const app = new Hono()
.basePath('/api')
.route('/', payments)
.route('/', hooks);

showRoutes(app, { verbose: false });

export default { port: process.env.PAYMENT_BACKEND_PORT, fetch: app.fetch };