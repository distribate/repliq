import ky from 'ky';
import { SKIN_ELY_URL } from '../shared/urls';
import { Hono } from 'hono';

export const getSkinRoute = new Hono().get('/get-skin/:nickname', async(c) => {
  const { nickname } = c.req.param();
  
  const url = `${SKIN_ELY_URL}/${nickname}.png`;
  
  try {
    const response = await ky.get(url);
    
    if (response.status === 404) {
      throw new Error('Image not found');
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    return c.body(buffer as unknown as ReadableStream, 200, {
      "Content-Type": "image/png",
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Error downloading skin details';
    return c.json({ error }, 500);
  }
});