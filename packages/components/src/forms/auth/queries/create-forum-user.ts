"use server";

import "server-only";
import { z } from "zod";
import { createUserBodySchema } from "authorization/src/lib/routes/create-user.ts";
import { authClient } from '@repo/lib/utils/api/auth-client.ts';

type UserDetails = z.infer<typeof createUserBodySchema>;

export async function createForumUser({
  nickname, password, realName, findout,
}: UserDetails) {
  const res = await authClient.register.$post({
    json: { nickname, password, realName, findout },
  });

  return await res.json();
}
