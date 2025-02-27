import { getExistsCustomPlayerSkin } from "./get-exists-custom-player-skin";
import { getExistsPlayerSkin } from "./get-exists-player-skin";
import type { Skin } from "#types/skin-type.ts";
import ky from "ky";
import fs from "fs/promises";
// @ts-ignore
import SteveSkin from "@repo/assets/images/minecraft/steve_skin.png";
import { Blob } from "buffer";
import path from "path";
import { skinsDB } from "#shared/database/skins-db.ts";

type GetPlayerSkin = {
  nickname: string
}

const CRAFATAR_API = ky.extend({
  prefixUrl: "https://api.mineatar.io/skin/"
})

async function getVanillaPlayerSkin(nickname: string) {
  const playerUUID = await skinsDB
    .selectFrom("sr_cache")
    .select("uuid")
    .where("name", "=", nickname)
    .executeTakeFirst();

  if (!playerUUID || !playerUUID.uuid) {
    return null
  }

  const queryPlayersSkins = await getExistsPlayerSkin({ nickname })

  if (queryPlayersSkins) {
    // const skinData = atob(queryPlayersSkins.skin_value);
    // const parsedSkinState = JSON.parse(skinData) as Skin;

    const blob = await CRAFATAR_API.get(playerUUID.uuid).blob() as unknown as Blob;

    if (!blob) {
      return null;
    }

    return blob
  }

  return null;
}

async function getCustomPlayerSkin(nickname: string) {
  const queryPlayersCustomSkins = await getExistsCustomPlayerSkin({ nickname })

  if (!queryPlayersCustomSkins) return null;

  if (queryPlayersCustomSkins.value) {
    const skinData = atob(queryPlayersCustomSkins.value);
    const parsedSkinData = JSON.parse(skinData) as Skin
    const blob = await ky.get(parsedSkinData.textures.SKIN.url).blob() as unknown as Blob;

    if (!blob) {
      return null;
    }

    return blob
  }

  return null;
}

export async function getPlayerSkin({
  nickname
}: GetPlayerSkin): Promise<Blob> {
  let skin: Blob | null = null;

  const customSkin = await getCustomPlayerSkin(nickname)

  if (customSkin) {
    skin = customSkin
  }

  if (skin) {
    return skin;
  }

  const vanillaSkin = await getVanillaPlayerSkin(nickname)

  if (vanillaSkin) {
    skin = vanillaSkin
  }

  if (!skin) {
    // @ts-ignore
    const filePath = path.resolve(SteveSkin);
    const buffer = await fs.readFile(filePath);

    const blob = new Blob([buffer], { type: 'image/png' });

    skin = blob;
  }

  return skin
}