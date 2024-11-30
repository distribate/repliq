'use server';

import 'server-only';
import { z } from 'zod';
import { createUserBodySchema } from 'authorization/src/lib/routes/create-user.ts';
import { authClient } from 'authorization/src';

type UserDetails = z.infer<typeof createUserBodySchema>

export async function createForumUser({
  nickname, password, realName, findout
}: UserDetails) {
  const res = await authClient.auth.register.$post({
    json: { nickname, password, realName, findout }
  })

  return await res.json()
}