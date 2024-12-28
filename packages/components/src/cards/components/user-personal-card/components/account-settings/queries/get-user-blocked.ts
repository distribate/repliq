"use server";

import { forumUserClient } from '@repo/shared/api/forum-client.ts';

export async function getUserBlocked(nickname: string) {
  const res = await forumUserClient.user["get-blocked-users"][":nickname"].$get({
    param: {
      nickname
    },
    query: {
      cursor: "1"
    }
  })
  
  const data = await res.json()
  
  if ("error" in data) {
    return null
  }

  return data
}