import { skinClient } from '@repo/shared/api/minecraft-client.ts';
import ky from 'ky';

type GetSkinDetails = {
  type: "head" | "skin"
  nickname: string
}

export async function getSkinDetails({ type, nickname }: GetSkinDetails) {
  const url = skinClient[`get-${type}`][":nickname"].$url({
    param: { nickname }
  })

  const blob = await ky.get(url).blob()

  return URL.createObjectURL(blob)
}