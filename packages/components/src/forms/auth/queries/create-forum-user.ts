"use server";

import "server-only";
import { z } from "zod";
import { authClient } from '@repo/shared/api/auth-client.ts';
import { createUserBodySchema } from "auth-backend/src/routes/create-user";

type UserDetails = z.infer<typeof createUserBodySchema>;

export async function createForumUser({
  nickname, password, realName, findout,
}: UserDetails) {
  const res = await authClient.register.$post({
    json: { nickname, password, realName, findout },
  });

  return await res.json();
}
