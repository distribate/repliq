import { getExistsCustomPlayerSkin } from "./get-exists-custom-player-skin";
import type { Skin } from "#types/skin-type.ts";
import ky from "ky";
import fs from "fs/promises";
// @ts-ignore
import SteveSkin from "@repo/assets/images/minecraft/steve_skin.png";
import { Blob } from "buffer";
import path from "path";
import { skinsDB } from "#shared/database/skins-db.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client";
import { USERS_SKINS_BUCKET } from "#index.ts";
import { Objm } from "@nats-io/obj";
import type { NatsConnection } from "@nats-io/transport-node";
import { readableStreamToBlob } from "bun";
import { blobToUint8Array, readableStreamFrom } from "#helpers/streams.ts";

async function getVanillaPlayerSkin(nickname: string): Promise<Blob | null> {
  const playerUUID = await skinsDB
    .selectFrom("sr_cache")
    .select("uuid")
    .where("name", "=", nickname)
    .executeTakeFirst();

  if (!playerUUID || !playerUUID.uuid) {
    return null
  }

  const blob = await ky.get(`https://api.mineatar.io/skin/${playerUUID.uuid}`).blob() as unknown as Blob;

  console.log(blob)

  if (!blob) {
    return null;
  }

  return blob
}

async function getCustomPlayerSkin(nickname: string): Promise<Blob | null> {
  const query = await getExistsCustomPlayerSkin({ nickname })

  if (query && query.value) {
    const skinData = atob(query.value);
    const parsedSkinData = JSON.parse(skinData) as Skin
    const blob = await ky.get(parsedSkinData.textures.SKIN.url).blob() as unknown as Blob;

    if (!blob) {
      return null;
    }

    return blob
  } else {
    return null;
  }
}

async function getSkinByKv(nickname: string): Promise<Blob | null> {
  const nc = getNatsConnection();
  // @ts-ignore
  const objm = new Objm(nc);
  const bucket = await objm.open(USERS_SKINS_BUCKET);

  const entry = await bucket.get(nickname)

  if (!entry || !entry?.data) {
    return null;
  }

  // @ts-ignore
  return readableStreamToBlob(entry.data)
}

async function putSkinInKv(nickname: string, skinData: Uint8Array) {
  const nc: NatsConnection = getNatsConnection();
  // @ts-ignore
  const objm = new Objm(nc);
  const bucket = await objm.open(USERS_SKINS_BUCKET);

  const stream = readableStreamFrom(skinData);
  
  await bucket.put({ name: nickname }, stream);
}

export async function getPlayerSkin(nickname: string): Promise<Blob> {
  let skin: Blob | null = null;

  const existsSkinByKv = await getSkinByKv(nickname)

  if (existsSkinByKv) {
    skin = existsSkinByKv
  }

  if (skin) {
    return skin;
  }

  const customSkin = await getCustomPlayerSkin(nickname)

  if (customSkin) {
    // @ts-ignore
    const array = await blobToUint8Array(customSkin as globalThis.Blob)

    await putSkinInKv(nickname, array)

    skin = customSkin
  }

  if (skin) {
    return skin;
  }

  const vanillaSkin = await getVanillaPlayerSkin(nickname)

  if (vanillaSkin) {
    // @ts-ignore
    const array = await blobToUint8Array(vanillaSkin as globalThis.Blob)

    await putSkinInKv(nickname, array)

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