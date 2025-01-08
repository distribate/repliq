import ky from 'ky';
import { SKIN_ELY_URL } from '#shared/constants/external-skin-api-urls.ts';
import { Hono } from 'hono';

export const downloadSkinRoute = new Hono().get('/download-skin/:nickname', async(c) => {
  const { nickname } = c.req.param();
  
  const url = `${SKIN_ELY_URL}/${nickname}.png`;
  
  try {
    const response = await ky.get(url);
    const buffer = Buffer.from(await response.arrayBuffer())

    return c.body(buffer as unknown as ReadableStream, 200, {
      "Content-Type": "image/png",
      'Content-Disposition': `attachment; filename=${nickname}-skin.png`
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Error fetching the skin file';
    return c.json({ error }, 500);
  }
});