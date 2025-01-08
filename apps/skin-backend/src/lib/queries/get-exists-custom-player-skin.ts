import { skinsDB } from "#shared/database/skins-db.ts";

type GetExistsCustomPlayerSkinType = {
  nickname: string
}

export async function getExistsCustomPlayerSkin({
  nickname
}: GetExistsCustomPlayerSkinType) {
  const queryPlayersCustomSkins = await skinsDB
    .selectFrom('sr_players')
    .innerJoin('sr_cache', 'sr_cache.uuid', 'sr_players.uuid')
    .where("sr_cache.name", "=", nickname)
    .select([
      "sr_players.skin_identifier", 
      "sr_players.skin_variant"
    ])
    .executeTakeFirst();

  if (!queryPlayersCustomSkins?.skin_identifier || !queryPlayersCustomSkins?.skin_variant) {
    return null;
  }

  const { skin_identifier, skin_variant } = queryPlayersCustomSkins

  return { skin_identifier, skin_variant }
}