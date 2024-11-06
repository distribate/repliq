"use server"

import { cookies } from 'next/headers';
import { RESIZABLE_LAYOUT_COOKIE_KEY } from '@repo/shared/keys/cookie.ts';

export async function updateLayoutSizes(sizes: number[]) {
  cookies().set(RESIZABLE_LAYOUT_COOKIE_KEY, JSON.stringify(sizes));
}