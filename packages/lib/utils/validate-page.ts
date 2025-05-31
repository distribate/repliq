import { Ctx } from '@reatom/core';
import { isAuthenticatedAtom } from "#queries/global-option-query.ts";
import { authClient } from "@repo/shared/api/auth-client";
import { redirect } from '@tanstack/react-router';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes';
import { currentUserResource } from '#helpers/get-user.ts';
import { logger } from './logger';
import { forumUserClient } from '@repo/shared/api/forum-client';

const RESTRICT_PATH = "/restrict"
const DEVELOPMENT_PATH = "/development"
const WHITELIST = [DEVELOPMENT_PATH, RESTRICT_PATH]

async function validateSession(): Promise<boolean> {
  const res = await authClient["validate-session"].$get();

  let data: { data: boolean } | { error: string | null } | null = null;

  try {
    data = await res.json()
  } catch (e) {
    logger.error(e)

    throw redirect({ to: DEVELOPMENT_PATH })
  }

  if (typeof data !== 'object') {
    throw redirect({ to: DEVELOPMENT_PATH })
  }

  if ("error" in data) {
    // @ts-expect-error
    if (res.status === 429) {
      throw redirect({ to: RESTRICT_PATH })
    }

    return false;
  }

  return Boolean(data.data)
}

export async function validateAdmin() {
  const res = await forumUserClient.user["get-is-admin"].$get()
  const data = await res.json()

  if (!data || "error" in data) return false;

  return Boolean(data.data)
}

function validateWhitelistPath() {
  logger.info("validating whitelist path")
}

/**
 * @param {"redirect" | undefined} [type=undefined] - Specifies behavior if the user is not authenticated.
 * If "redirect", performs a redirect. If undefined (default), no redirect occurs.
 * 
 * @returns boolean - true if user is authenticated
 * @throws redirect - if user is not authenticated and type is "redirect"
 */
export async function validatePage(
  ctx: Ctx,
  type: "redirect" | undefined = undefined
): Promise<boolean> {
  if (WHITELIST.includes(window.location.pathname)) {
    validateWhitelistPath()
  }

  let isAuthenticated = false;

  const cache = ctx.get(isAuthenticatedAtom);

  if (!cache) {
    logger.info(`validating authentication status`)

    isAuthenticated = await validateSession();

    isAuthenticatedAtom(ctx, isAuthenticated)
  } else {
    isAuthenticated = cache;
  }

  if (!isAuthenticated && type === "redirect") {
    throw redirect({ to: AUTH_REDIRECT })
  }

  if (isAuthenticated) {
    await currentUserResource(ctx)
  }

  return isAuthenticated
}