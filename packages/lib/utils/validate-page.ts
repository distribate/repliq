import { validateSession } from "#actions/validate-session.ts";
import { GLOBAL_OPTION_QUERY_KEY, GlobalOptionQuery } from "#queries/global-option-query.ts";
import type { QueryClient } from "@tanstack/react-query";

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