import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema.ts';
import { z } from 'zod';

type UpdateUserFields = z.infer<typeof userDetailsSchema>

export async function updateUserFields({
  criteria, value
}: UpdateUserFields) {
  const res = await forumUserClient.user["edit-user-details"].$post({
    json: { criteria, value }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.data;
}