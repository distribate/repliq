import { SKIN_GET_HEAD, SKIN_GET_SKIN } from '@repo/shared/constants/routes.ts';
import SteveHead from '@repo/assets/images/minecraft/steve_head.jpg';
import SteveSkin from '@repo/assets/images/default.png';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import ky from 'ky';

type SkinDetails = {
  type: 'skin' | 'head';
} & Pick<UserEntity, 'nickname'>;

export async function getSkinDetails({
  type, nickname,
}: SkinDetails): Promise<string> {
  if (type === 'skin') {
    try {
      const skinBlob = await ky(nickname, {
        prefixUrl: SKIN_GET_SKIN,
        retry: 1,
        cache: 'force-cache'
      }).blob()
      
      return URL.createObjectURL(skinBlob);
    } catch (e) {
      return SteveSkin.src as string;
    }
  } else {
    try {
      const headBlob = await ky(nickname.toLowerCase(), {
        prefixUrl: SKIN_GET_HEAD,
        retry: 1,
        cache: 'force-cache'
      }).blob()
      
      return URL.createObjectURL(headBlob);
    } catch (e) {
      return SteveHead.src as string;
    }
  }
}