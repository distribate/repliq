import { Ctx } from '@reatom/core';
import { globalOptionsAtom } from "#queries/global-option-query.ts";
import { authClient } from "@repo/shared/api/auth-client";

async function validateSession (): Promise<boolean> {
  const res = await authClient["get-session"].$get();
  const data = await res.json();

  if (!data || "error" in data) return false;
  if (data.data) return true

  return false
}

export async function validatePage(ctx: Ctx): Promise<boolean> {
  let isAuthenticated: boolean = false;

  const cache = ctx.get(globalOptionsAtom).isAuthenticated;

  if (!cache) {
    isAuthenticated = await validateSession();

    globalOptionsAtom(ctx, (prev) => ({...prev, isAuthenticated }) )
  } else {
    isAuthenticated = cache;
  }

  return isAuthenticated
}