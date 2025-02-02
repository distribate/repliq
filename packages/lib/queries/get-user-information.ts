import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import ky from 'ky';
import { decode } from 'cbor-x';

export async function getUserInformation(): Promise<UserDetailed> {
  const url = forumUserClient.user["get-me"].$url()

  const res = await ky.get(url, {
    credentials: "include"
  })

  const encodedData = await res.arrayBuffer()

  if (!encodedData) {
    throw new Error("Failed decode")
  }

  const uint8Data = new Uint8Array(encodedData);

  const data: { data: UserDetailed } | { error: string } = decode(uint8Data);

  if ("error" in data) {
    throw new Error("Failed user information")
  }

  return data.data
}