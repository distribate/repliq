import { skinsDB } from "#shared/database/skins-db.ts";

export async function getExistsCustomPlayerSkin(uuid: string) {
  const queryPlayersCustomSkins = await skinsDB
    .selectFrom('sr_players')
    .select(["skin_identifier", "skin_variant"])
    .where("uuid", "=", uuid)
    .executeTakeFirst();

  return queryPlayersCustomSkins?.skin_identifier ?? null
}