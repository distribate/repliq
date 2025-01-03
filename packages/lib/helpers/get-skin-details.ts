import { skinClient } from '@repo/shared/api/skin-client.ts';
import { SKIN_GET_HEAD } from '@repo/shared/constants/routes.ts';
import SteveHead from '@repo/assets/images/minecraft/steve_head.jpg';
import SteveSkin from '@repo/assets/images/default.png';
import ky from 'ky';

export async function getHeadDetails(nickname: string) {
  try {
    const headBlob = await ky(nickname, { prefixUrl: SKIN_GET_HEAD, retry: 1 }).blob()

    return URL.createObjectURL(headBlob);
  } catch (e) {
    return SteveHead.src as string;
  }
}

export async function getSkinDetails(uuid: string) {
  try {
    const res = await skinClient.api["get-skin"][":uuid"].$get({
      param: {
        uuid
      }
    })

    if (!res) {
      return SteveSkin.src as string
    }

    const skinUrl = await res.json()

    if (!skinUrl.skin) {
      return SteveSkin.src as string
    }

    return skinUrl.skin
  } catch (e) {
    return SteveSkin.src as string
  }
}