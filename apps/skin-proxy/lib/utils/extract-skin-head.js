var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { server } from "../../index.js";
import ky from "ky";
import { PNG } from "pngjs";
import sharp from "sharp";
function processSkin(nickname) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${server.config.SKIN_ELY_URL}/${nickname}.png`;
        try {
            const response = yield ky.get(url);
            if (response.status === 404) {
                throw new Error('Image not found');
            }
            const skinBuffer = Buffer.from(yield response.arrayBuffer());
            return skinBuffer;
        }
        catch (error) {
            throw new Error(`Error downloading skin image: ${error}`);
        }
    });
}
function extractHeadAndResize(png) {
    return __awaiter(this, void 0, void 0, function* () {
        const format = (png.height === 64) ? 'ALEX' : 'STEVE';
        const headStartX = 8;
        const headStartY = 8;
        const headSize = 8;
        const headImage = new PNG({ width: headSize, height: headSize });
        for (let y = 0; y < headSize; y++) {
            for (let x = 0; x < headSize; x++) {
                let idx;
                if (format === 'ALEX') {
                    idx = (headStartY + y) * png.width * 4 + (headStartX + x) * 4;
                }
                else {
                    idx = (headStartY + y) * png.width * 4 + (headStartX + x) * 4;
                }
                const idxHead = y * headSize * 4 + x * 4;
                headImage.data[idxHead] = png.data[idx];
                headImage.data[idxHead + 1] = png.data[idx + 1];
                headImage.data[idxHead + 2] = png.data[idx + 2];
                headImage.data[idxHead + 3] = png.data[idx + 3];
            }
        }
        const headBuffer = PNG.sync.write(headImage);
        const resizedHeadBuffer = yield sharp(headBuffer)
            .resize({
            width: 128, height: 128, fit: 'cover'
        })
            .toBuffer();
        return resizedHeadBuffer;
    });
}
