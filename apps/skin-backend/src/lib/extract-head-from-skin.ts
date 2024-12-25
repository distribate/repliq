import { createCanvas, loadImage } from "canvas";

export async function extractMinecraftHeadFromBlob(
  blob: Blob, scale: number = 2
): Promise<Buffer> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const skin = await loadImage(buffer);

    if (skin.width !== 64 || skin.height !== 64) {
      throw new Error('Изображение должно быть размером 64x64.');
    }

    const headSize = 8 * scale; 
    const canvas = createCanvas(headSize, headSize);
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;

    ctx.drawImage(skin, 8, 8, 8, 8, 0, 0, headSize, headSize);
    ctx.drawImage(skin, 40, 8, 8, 8, 0, 0, headSize, headSize);

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Ошибка при обработке скина:', error);
    throw error;
  }
}