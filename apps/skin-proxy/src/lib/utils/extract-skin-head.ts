import { server } from "../../index.js";
import ky from "ky";
import { PNG } from "pngjs";
import sharp from "sharp";

async function processSkin(
	nickname: string
): Promise<Buffer> {
	const url = `${server.config.SKIN_ELY_URL}/${nickname}.png`;
	
	try {
		const response = await ky.get(url);
		
		if (response.status === 404) {
			throw new Error('Image not found');
		}
		
		const skinBuffer = Buffer.from(
			await response.arrayBuffer()
		);

		return skinBuffer;
	} catch (error) {
		throw new Error(
			`Error downloading skin image: ${error}`
		);
	}
}

async function extractHeadAndResize(
	png: PNG
): Promise<Buffer> {
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
			} else {
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
	
	const resizedHeadBuffer = await sharp(headBuffer)
	.resize({
		width: 128,	height: 128,	fit: 'cover'
	})
	.toBuffer();
	
	return resizedHeadBuffer;
}