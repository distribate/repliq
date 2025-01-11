import { skinClient } from '@repo/shared/api/skin-client.ts';
import SteveHead from '@repo/assets/images/minecraft/steve_head.jpg';
import SteveSkin from '@repo/assets/images/default.png';
import ky from 'ky';

export async function getHeadDetails(nickname: string) {
  try {
    const url = skinClient["get-head"][":nickname"].$url({
      param: { nickname }
    })

    const headBlob = await ky.get(url).blob()

    return URL.createObjectURL(headBlob);
  } catch (e) {
    return SteveHead.src as string;
  }
}

export async function getSkinDetails(nickname: string) {
  try {
    const url = skinClient["get-skin"][":nickname"].$url({
      param: { nickname }
    })

    const skinBlob = await ky.get(url).blob()

    return URL.createObjectURL(skinBlob)
  } catch (e) {
    return SteveSkin.src as string
  }
}