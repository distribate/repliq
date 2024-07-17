var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { server } from "../index.js";
import ky from "ky";
const opts = {
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nickname } = request.params;
            const url = `${server.config.SKIN_ELY_URL}/${nickname}.png`;
            try {
                const response = yield ky.get(url);
                const buffer = Buffer.from(yield response.arrayBuffer());
                reply
                    .header('Content-Disposition', `attachment; filename=${nickname}-skin.png`)
                    .type('image/png')
                    .send(buffer);
            }
            catch (error) {
                reply.status(500).send('Error fetching the file');
            }
        });
    }
};
const downloadSkinRoute = function (instance, options, done) {
    instance.get('/download-skin/:nickname', opts);
    done();
};
export default downloadSkinRoute;
