import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import ky, { HTTPError } from 'ky';
import { decode } from 'cbor-x';
import { redirect } from '@tanstack/react-router';

export async function getUserInformation(): Promise<UserDetailed> {
  const url = forumUserClient.user["get-me"].$url()

  try {
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
  } catch (e: unknown) {
    if (e instanceof HTTPError) {
      const body = await e.response.json()

      if (body.status === "You are banned") {
        throw redirect({
          to: `/banned?reason=${body.data.reason}&time=${body.data.time}&created_at=${body.data.created_at}`
        })
      }
    }

    // @ts-ignore
    throw new Error(e)
  }
}