import sharp from "sharp";

export async function extractHeadFromSkin(sb: ArrayBuffer) {
  const b = await sharp(sb)
    .extract({ left: 8, top: 8, width: 8, height: 8 })
    .resize(128, 128, { kernel: 'nearest' })
    .toBuffer();

  return b;
}