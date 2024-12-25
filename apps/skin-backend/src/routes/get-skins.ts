import { forumDB } from '@repo/shared/db/forum-db';
import { decode } from 'base-64';
import { Hono } from 'hono';
import { skinsDB } from '@repo/shared/db/skins-db';

type SkinState = { 
  textures: {
    SKIN: {
      url: string, 
      metadata: {
        model: string 
      } 
    } 
  }
}

async function getExistsCustomPlayerSkin(uuid: string) {
  const queryPlayersCustomSkins = await skinsDB
  .selectFrom('sr_players')
  .select(["skin_identifier", "skin_variant"])
  .where("uuid", "=", uuid)
  .executeTakeFirst();

  return queryPlayersCustomSkins?.skin_identifier
}

async function getExistsPlayerSkin(uuid: string) {
  const queryPlayersSkins = await skinsDB
    .selectFrom('sr_player_skins')
    .select("value")
    .where("uuid", "=", uuid)
    .executeTakeFirst();

  return queryPlayersSkins?.value
}

export const getSkinRoute = new Hono().get('/get-skin/:uuid', async (ctx) => {
  const { uuid } = ctx.req.param();
  
  let skinUrl: string | null = null;

  const queryPlayersCustomSkins = await getExistsCustomPlayerSkin(uuid)
    
  if (queryPlayersCustomSkins) {
    skinUrl = queryPlayersCustomSkins
  }

  const queryPlayersSkins = await getExistsPlayerSkin(uuid)

  if (queryPlayersSkins) {
    const skinState = decode(queryPlayersSkins);
    const parsedSkinState: SkinState = JSON.parse(skinState);

    skinUrl = parsedSkinState.textures.SKIN.url
  }

  if (!queryPlayersSkins && !queryPlayersCustomSkins) {
    const userNickname = await forumDB
    .selectFrom("users")
    .select('nickname')
    .where('uuid', '=', uuid)
    .executeTakeFirst()
  
    skinUrl = `https://mineskin.eu/skin/${userNickname?.nickname}`
  }

  return ctx.json({ skin: skinUrl ?? null }, 200);
});