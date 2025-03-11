import { GLOBAL_OPTION_QUERY_KEY, GlobalOptionQuery } from "#queries/global-option-query.ts";
import { authClient } from "@repo/shared/api/auth-client";
import type { QueryClient } from "@tanstack/react-query";

async function validateSession (): Promise<boolean> {
  const res = await authClient["get-session"].$get();
  const data = await res.json();

  if (!data || "error" in data) {
    return false;
  }

  if (data.data) {
    return true
  }

  return false
}

export async function validatePage(ctx: QueryClient): Promise<boolean> {
  let isAuthenticated: boolean = false;

  const cache: boolean | undefined = ctx.getQueryData<GlobalOptionQuery>(GLOBAL_OPTION_QUERY_KEY)?.isAuthenticated

  if (!cache) {
    isAuthenticated = await validateSession();

    ctx.setQueryData(GLOBAL_OPTION_QUERY_KEY,
      (prev: GlobalOptionQuery) => ({ ...prev, isAuthenticated })
    )
  } else {
    isAuthenticated = cache;
  }

  return isAuthenticated
}