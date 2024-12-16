"use server";

import "server-only";
import { getCurrentSession } from "#actions/get-current-session.ts";
import { forumUserClient } from '#utils/api/forum-client.ts';
import { userDetailsSchema } from '@repo/types/schemas/user/edit-user-details-schema.ts';
import { z } from 'zod';

export type UpdateUserFields = Omit<z.infer<typeof userDetailsSchema>, "userId">

export async function updateUserFields({
  criteria, value
}: UpdateUserFields) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;
  
  const { id } = currentUser
  
  const res = await forumUserClient.user["edit-user-details"].$post({
    json: { value, criteria, userId: id }
  })

  const updatedValue = await res.json()
  
  return updatedValue;
}