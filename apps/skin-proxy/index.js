var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fastify } from "fastify";
import fastifyEnv from "@fastify/env";
import cors from "@fastify/cors";
import { envSchema } from "./lib/schemas/env-schema.js";
import getSkinRoute from "./routes/get-skins.js";
import getHeadRoute from "./routes/get-head.js";
import downloadSkin from "./routes/download-skin.js";
export const server = fastify({
    logger: false
});
const options = {
    confKey: 'config', schema: envSchema
};
server.register(fastifyEnv, options)
    .ready((err) => {
    if (err)
        console.error(err);
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
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            cb(null, true);
        }
        else {
            cb(new Error("Not allowed"), false);
        }
    }
});
server.register(getSkinRoute);
server.register(getHeadRoute);
server.register(downloadSkin);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield server.listen({
                port: 8000
            });
            console.log(server.printRoutes());
            console.log(`.env variables:\n${JSON.stringify(server.config)}`);
        }
        catch (err) {
            console.error('Error starting server:', err);
            process.exit(1);
        }
    });
}
start();
