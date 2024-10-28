import { fastify } from "fastify";
import fastifyEnv from "@fastify/env";
import cors from "@fastify/cors";
import { envSchema } from "./lib/schemas/env-schema.js";
import getSkinRoute from "./routes/get-skins.js";
import getHeadRoute from "./routes/get-head.js";
import downloadSkin from "./routes/download-skin.js";

declare module 'fastify' {
	interface FastifyInstance {
		config: { SKIN_ELY_URL: string, SKIN_HEAD_ELY_URL: string };
	}
}

export const server = fastify({
	logger: false
})

const options = {
	confKey: 'config', schema: envSchema
}

server.register(fastifyEnv, options)
	.ready((err) => {
		if (err) console.error(err)
})

server.register(cors, {
	origin: (origin, cb) => {
		if (!origin) {
			cb(null, false);
			
			return;
		}
		
		const url = new URL(origin);
		const hostname = url.hostname;
		
		// Allow requests from localhost and 127.0.0.1
		if (hostname === "localhost" || hostname === "127.0.0.1") {
			cb(null, true);
		} else {
			cb(new Error("Not allowed"), false);
		}
	}
})

server.register(getSkinRoute)
server.register(getHeadRoute)
server.register(downloadSkin)

async function start() {
	try {
		await server.listen({
			port: 8000
		});
		
		console.log(server.printRoutes());
		console.log(`.env variables:\n${JSON.stringify(server.config)}`);
	} catch (err) {
		console.error('Error starting server:', err);
		process.exit(1);
	}
}

start().then()