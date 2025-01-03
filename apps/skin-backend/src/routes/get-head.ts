import ky from 'ky';
import { SKIN_HEAD_ELY_URL } from '../shared/urls';
import { Hono } from 'hono';

export const getHeadRoute = new Hono()
  .get("/get-head/:nickname", async (ctx) => {
  const { nickname } = ctx.req.param()
  
  const url = `${SKIN_HEAD_ELY_URL}/${nickname.toLowerCase()}.png&scale=18.9&renderFace=1`;
  
  try {
    const response = await ky.get(url);
    
    if (response.status === 404) {
      throw new Error("Image not found");
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    return ctx.body(buffer as unknown as ReadableStream, 200, {
      "Content-Type": "image/png",
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : "Error downloading skin details";
    return ctx.json({ error }, 500);
  }
})