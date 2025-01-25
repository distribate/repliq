import { getExistsCustomPlayerSkin } from "./get-exists-custom-player-skin";
import { getExistsPlayerSkin } from "./get-exists-player-skin";
import type { Skin } from "#types/skin-type.ts";
import ky from "ky";
import fs from "fs/promises";
// @ts-ignore
import SteveSkin from "@repo/assets/images/minecraft/steve_skin.png";
import { Blob } from "buffer";
import path from "path";

type GetPlayerSkin = {
  nickname: string
}

export async function getPlayerSkin({
  nickname
}: GetPlayerSkin): Promise<Blob> {
  let skin: Blob | null = null;

  // get custom player skin
  const queryPlayersCustomSkins = await getExistsCustomPlayerSkin({ nickname })

  if (queryPlayersCustomSkins) {
    const skinUrl = queryPlayersCustomSkins.skin_identifier
    const blob = await ky.get(skinUrl).blob() as unknown as Blob;

    if (!blob) {
      skin = null;
    } else {
      skin = blob
    }
  }

  // get vanilla player skin
  const queryPlayersSkins = await getExistsPlayerSkin({ nickname })

  if (queryPlayersSkins) {
    const skinData = atob(
      queryPlayersSkins.skin_value
    );

    const parsedSkinState: Skin = JSON.parse(skinData);

    const blob = await ky.get(
      parsedSkinState.textures.SKIN.url
    ).blob() as unknown as Blob;

    if (!blob) {
      skin = null;
    } else {
      skin = blob
    }
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