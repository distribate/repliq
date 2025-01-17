import { skinsDB } from "#shared/database/skins-db.ts";

type GetExistsPlayerSkinType = {
  nickname: string
}

export async function getExistsPlayerSkin({
  nickname
}: GetExistsPlayerSkinType) {
  const queryPlayersSkins = await skinsDB
    .selectFrom('sr_player_skins')
    .select("value")
    .where("last_known_name", "=", nickname)
    .executeTakeFirst();

  if (!queryPlayersSkins?.value) {
    return null;
  }

  const { value } = queryPlayersSkins

  return {
    skin_value: value
  }
}