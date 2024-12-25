import { hc } from 'hono/client';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getHeadRoute } from '#routes/get-head.ts';
import { getSkinRoute } from '#routes/get-skins.ts';
import { downloadSkinRoute } from '#routes/download-skin.ts';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const port = process.env.SKIN_PROXY_PORT

if (!process.env.SKIN_PROXY_PORT) {
  throw new Error("skin proxy port is not defined")
}

const app = new Hono()
.use("*", cors({
  origin: "*",
  allowMethods: ['GET']
}))
.use("*", logger())
.route("/", getHeadRoute)
.route("/", getSkinRoute)
.route("/", downloadSkinRoute)

export const client = hc<typeof app>("http://localhost:4102/")

showRoutes(app, { verbose: true })

export default { port, fetch: app.fetch }