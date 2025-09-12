import { createCtx, Ctx } from '@reatom/core';
import { authClient } from "#shared/api/auth-client";
import { userClient } from '#shared/api/forum-client';
import { IS_AUTHENTICATED_ATOM_KEY, isAuthenticatedAtom } from '#components/auth/models/auth.model';
import { logger } from '@repo/shared/utils/logger.ts';
import { currentUserAtom, getUserGlobalOptions, getUserInformation, userGlobalOptionsAtom } from '#components/user/models/current-user.model';
import { redirect } from 'vike/abort'
import { PageContext } from 'vike/types';
import { snapshotAtom } from './ssr';
import { client } from '#shared/api/client';

const AUTH_PATH = "/auth"
const DEV_MODE_PATH = "/not-online"
const WHITELIST_PATHS = [DEV_MODE_PATH]

const url = authClient["validate-session"].$url();

async function validateSession({ headers }: RequestInit): Promise<boolean> {
  const res = await client(url, { headers, retry: 1 });

  if (!res.ok) throw new Error()
  
  let data: WrappedResponse<boolean>

  try {
    data = await res.json<WrappedResponse<boolean>>()
  } catch (e) {
    throw new Error(DEV_MODE_PATH)
  }

  if ("error" in data) {
    if (res.status === 401) throw new Error(AUTH_PATH)
    if (res.status === 500) throw new Error(DEV_MODE_PATH)
    throw new Error(data.error)
  }

  return data.data
}

function updateSnapshot(ctx: Ctx, pageContext: PageContext) {
  const snapshot = ctx.get(snapshotAtom) ?? {}
  const newSnapshot = { ...pageContext.snapshot, ...snapshot }
  pageContext.snapshot = newSnapshot
  return newSnapshot
}

export async function defineGlobalState(pageContext: PageContext): Promise<void> {
  const headers = pageContext.headers;
  const pathname = pageContext.urlPathname

  let isAuthenticated = false;

  const ctx = createCtx({ restrictMultipleContexts: false });

  if (pageContext.isPrerendering) {
    function prerenderState() {
      isAuthenticatedAtom(ctx, isAuthenticated);
    }

    console.log(`[Prerender] ${pathname} - execute prerenderState`);
    prerenderState()

    const newSnap = updateSnapshot(ctx, pageContext)
    console.log(`[Prerender] ${pathname} finish snapshot`, newSnap);
  }

  // when pageContext.isPrerendering = true -> headers === null
  if (!headers) return;

  if (WHITELIST_PATHS.includes(pathname)) {
    function validateWhitelistPath() {
      logger.info("validating whitelist path")
    }

    validateWhitelistPath()
  }

  try {
    isAuthenticated = await validateSession({ headers });
  } catch (e) {
    logger.error(e);

    if (e instanceof Error) {
      if (e.message === DEV_MODE_PATH) throw redirect(DEV_MODE_PATH);
      if (e.message === AUTH_PATH) throw redirect(AUTH_PATH)
    }

    throw e
  }

  isAuthenticatedAtom(ctx, isAuthenticated);

  if (isAuthenticated && pathname.includes(AUTH_PATH)) {
    throw redirect("/home")
  }

  if (isAuthenticated) {
    const [userInfo, userOptions] = await Promise.all([
      getUserInformation({ headers }),
      getUserGlobalOptions({ headers })
    ])

    if (!userInfo || !userOptions) throw redirect("/500")

    currentUserAtom(ctx, userInfo);
    userGlobalOptionsAtom(ctx, userOptions)
  }

  updateSnapshot(ctx, pageContext)
}

export function validatePage({ snapshot }: PageContext) {
  const isAuth = snapshot[IS_AUTHENTICATED_ATOM_KEY]?.data ?? false;
  if (!isAuth) throw redirect(AUTH_PATH)
}

export async function validateAdmin(init?: RequestInit): Promise<boolean> {
  const res = await userClient.user["is-admin"].$get({}, { init })
  const data: WrappedResponse<boolean> = await res.json() 

  if ("error" in data) throw new Error(data.error)

  return data.data
}