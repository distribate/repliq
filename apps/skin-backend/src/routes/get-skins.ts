import { getExistsCustomPlayerSkin } from '#lib/queries/get-exists-custom-player-skin.ts';
import { getExistsPlayerSkin } from '#lib/queries/get-exists-player-skin.ts';
import { getUserNickname } from '#lib/queries/get-user-nickname.ts';
import type { Skin } from '#types/skin-type.ts';
import { decode } from 'base-64';
import { Hono } from 'hono';

export const getSkinRoute = new Hono()
  .get('/get-skin/:uuid', async (ctx) => {
    const { uuid } = ctx.req.param();

    let skinUrl: string | null = null;

    const queryPlayersCustomSkins = await getExistsCustomPlayerSkin(uuid)

    if (queryPlayersCustomSkins) {
      skinUrl = queryPlayersCustomSkins
    }

    console.log(queryPlayersCustomSkins)

    const queryPlayersSkins = await getExistsPlayerSkin(uuid)

    if (queryPlayersSkins) {
      const skinState = decode(queryPlayersSkins);
      const parsedSkinState: Skin = JSON.parse(skinState);

      skinUrl = parsedSkinState.textures.SKIN.url
    }

    console.log(queryPlayersSkins)

    if (!queryPlayersSkins && !queryPlayersCustomSkins) {
      const userNickname = await getUserNickname(uuid)

      skinUrl = `https://mineskin.eu/skin/${userNickname?.nickname}`
    }

    console.log(skinUrl)

    return ctx.json({ skin: skinUrl ?? null }, 200);
  });