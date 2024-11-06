"use server"

import { cookies } from 'next/headers';
import { RESIZABLE_LAYOUT_COOKIE_KEY } from '@repo/shared/keys/cookie.ts';

const DEFAULT_LAYOUT_SIZES = [ 16, 84 ];

export async function getLayoutSizes(): Promise<number[]> {
  const layout = cookies().get(RESIZABLE_LAYOUT_COOKIE_KEY);
  return layout ? JSON.parse(layout.value) as number[] : DEFAULT_LAYOUT_SIZES;
}