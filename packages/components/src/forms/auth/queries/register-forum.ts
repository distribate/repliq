import { z } from "zod";
import { authClient } from '@repo/shared/api/auth-client.ts';
import { createUserBodySchema } from "auth-backend/src/routes/register";

type UserDetails = z.infer<typeof createUserBodySchema>;

export async function registerForum({
  nickname, password, realName, findout,
}: UserDetails) {
  const res = await authClient.register.$post({
    json: { nickname, password, realName, findout },
  });

  const data = await res.json();

  if (!data) {
    return null;
  }

  return data
}