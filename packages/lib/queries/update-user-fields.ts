import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema.ts';
import { z } from 'zod';

export async function updateUserFields({
  criteria, value
}: z.infer<typeof userDetailsSchema>) {
  const res = await forumUserClient().user["edit-user-details"].$post({
    json: { criteria, value }
  })

  const updatedValue = await res.json()

  return updatedValue;
}