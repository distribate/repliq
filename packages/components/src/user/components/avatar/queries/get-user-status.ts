"use server"

import { forumUserClient } from "@repo/shared/api/forum-client"

export async function getUserStatus(nickname: string) {
  const res = await forumUserClient.user["get-user-game-status"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await  res.json()

  if (!data || "error" in data) {
    return null
  }
  
  return data
}