import { fastify } from 'fastify';
import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { envSchema } from '#lib/schemas/env-schema';
import getSkinRoute from '#lib/routes/get-skins';
import getHeadRoute from '#lib/routes/get-head';
import downloadSkin from '#lib/routes/download-skin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

declare module 'fastify' {
  interface FastifyInstance {
    config: { SKIN_ELY_URL: string; SKIN_HEAD_ELY_URL: string };
  }
}

export const server = fastify({ logger: false });

const options = {
  confKey: 'config', schema: envSchema,
};

server
// @ts-ignore
.register(fastifyEnv, options)
.ready((err) => {
  if (err) console.error(err);
});

server.register(cors, {
  origin: (origin, cb) => {
    if (!origin) {
      cb(null, false);
      
      return;
    }
    
    const url = new URL(origin);
    const hostname = url.hostname;
    
    // Allow requests from localhost and 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      cb(null, true);
    } else {
      cb(new Error('Not allowed'), false);
    }
  },
});

server.register(getSkinRoute);
server.register(getHeadRoute);
server.register(downloadSkin);

async function start() {
  if (!process.env.SKIN_PROXY_PORT) {
    throw new Error('SKIN_PROXY_PORT is not defined in .env');
  }
  
  try {
    const port = Number(process.env.SKIN_PROXY_PORT)
    
    await server.listen({ port });
    
    console.log(`Skin Proxy started on ${port} port`)
    console.log(server.printRoutes());
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();