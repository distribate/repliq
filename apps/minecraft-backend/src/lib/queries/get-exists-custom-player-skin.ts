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
    .innerJoin("sr_player_skins", "sr_player_skins.uuid", "sr_players.skin_identifier")
    .where("sr_cache.name", "=", nickname)
    .select([
      "sr_players.skin_variant",
      "sr_player_skins.value",
    ])
    .executeTakeFirst();

  if (!queryPlayersCustomSkins?.value) {
    return null;
  }

  const { skin_variant, value } = queryPlayersCustomSkins

  return { skin_variant: skin_variant ?? "CLASSIC", value }
}