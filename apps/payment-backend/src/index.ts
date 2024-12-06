import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { createOrderRoute } from '#routes/create-order.ts';
import { checkOrderRoute } from '#routes/check-order.ts';
import { loggerBot, fasberryBot } from '#shared/bot.ts';
import { connect } from '#lib/db/listener.ts';

// initializing tg bots
await fasberryBot.init();
await loggerBot.init();

// initializing pg listener
await connect();

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