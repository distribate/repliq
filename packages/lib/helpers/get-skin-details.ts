import { SKIN_GET_HEAD } from '@repo/shared/constants/routes.ts';
import SteveHead from '@repo/assets/images/minecraft/steve_head.jpg';
import SteveSkin from '@repo/assets/images/default.png';
import ky from 'ky';

export async function getHeadDetails(nickname: string) {
  try {
    const headBlob = await ky(nickname.toLowerCase(), {
      prefixUrl: SKIN_GET_HEAD,
      retry: 4,
      cache: 'force-cache'
    }).blob()

    return URL.createObjectURL(headBlob);
  } catch (e) {
    return SteveHead.src as string;
  }
}

export async function getSkinDetails(uuid: string) {
  try {
    const res = await ky.get(`http://localhost:9500/get-skin/${uuid}`)

    if (!res.ok) {
      return SteveSkin.src as string
    }

    const skinUrl = await res.json<{ skin: string }>()

    return skinUrl.skin
  } catch (e) {
    return SteveSkin.src as string
  }
}