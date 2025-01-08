import { skinsDB } from "#shared/database/skins-db.ts";

export async function getExistsPlayerSkin(uuid: string) {
  const queryPlayersSkins = await skinsDB
    .selectFrom('sr_player_skins')
    .select("value")
    .where("uuid", "=", uuid)
    .executeTakeFirst();

  return queryPlayersSkins?.value ?? null
}