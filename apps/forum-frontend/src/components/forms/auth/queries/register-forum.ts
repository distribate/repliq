import { z } from "zod";
import { authClient } from '@repo/shared/api/auth-client.ts';
import { registerSchema } from '@repo/types/schemas/auth/create-session-schema.ts';

type UserDetails = z.infer<typeof registerSchema>

export async function registerForum({
  nickname, password, findout, referrer, token
}: UserDetails) {
  const res = await authClient.register.$post({
    json: { nickname, password, findout, referrer, token },
  });

  const data = await res.json();

  if (!data) {
    return null;
  }

  return data
}