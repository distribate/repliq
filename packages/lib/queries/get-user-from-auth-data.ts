"use server"

import "server-only"
import ky from 'ky';
import type { AUTH } from 'authorization/types/db/auth-database-types.ts';
import { authorized } from '#helpers/authorize-req.ts';

export async function getUserFromAuthData(nickname: string) {
  return ky.get<{ data: AUTH | null }>(`http://localhost:3400/auth/get/${nickname}`, {
    ...authorized
  });
}