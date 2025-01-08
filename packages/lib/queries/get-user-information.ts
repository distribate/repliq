import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';

export async function getUserInformation(): Promise<UserDetailed> {
  const res = await forumUserClient().user["get-me"].$get()
  
  const data = await res.json()

  if ("error" in data) {
    const { error } = data;
    throw new Error(error)
  }

  return data as UserDetailed
}