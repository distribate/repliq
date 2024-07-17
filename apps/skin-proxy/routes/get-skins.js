var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ky from "ky";
import { server } from "../index.js";
const opts = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nickname } = request.params;
            const url = `${server.config.SKIN_ELY_URL}/${nickname}.png`;
            try {
                const response = yield ky.get(url);
                if (response.status === 404) {
                    throw new Error('Image not found');
                }
                reply.header('Content-Type', response.headers.get('content-type'));
                const buffer = Buffer.from(yield response.arrayBuffer());
                reply.status(200).send(buffer);
            }
            catch (error) {
                server.log.error('Error downloading image', error);
                reply.status(500).send('Error downloading image');
            }
        });
    }
};
const getSkinRoute = function (instance, options, done) {
    instance.get('/get-skin/:nickname', opts);
    done();
};
export default getSkinRoute;
