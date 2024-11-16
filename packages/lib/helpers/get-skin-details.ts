import { SKIN_GET_HEAD, SKIN_GET_SKIN } from '@repo/shared/constants/routes.ts';
import SteveHead from '@repo/assets/images/minecraft/steve_head.jpg';
import SteveSkin from '@repo/assets/images/default.png';
import { UserEntity } from '@repo/types/entities/entities-type.ts';

type SkinDetails = {
  type: 'skin' | 'head'
} & Pick<UserEntity, 'nickname'>

export async function getSkinDetails({
  type, nickname,
}: SkinDetails): Promise<string> {
  if (type === 'skin') {
    const rawSkin = await fetch(SKIN_GET_SKIN + nickname);
    
    if (!rawSkin.ok) {
      return SteveSkin.src as string;
    }
    
    const skinBlob = await rawSkin.blob();
    return URL.createObjectURL(skinBlob);
  } else {
    const rawHead = await fetch(SKIN_GET_HEAD + nickname.toLowerCase());
    
    if (!rawHead.ok) {
      return SteveHead.src as string;
    }
    
    const headBlob = await rawHead.blob();
    return URL.createObjectURL(headBlob);
  }
}