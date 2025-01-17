import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';

export async function getUserInformation(): Promise<UserDetailed> {
  const res = await forumUserClient().user["get-me"].$get()
  
  const data = await res.json()

  if ("error" in data) {
    throw new Error(data.error)
  }

  return data as UserDetailed
}