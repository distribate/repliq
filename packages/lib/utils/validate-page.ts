import { Ctx } from '@reatom/core';
import { isAuthenticatedAtom } from "#queries/global-option-query.ts";
import { authClient } from "@repo/shared/api/auth-client";
import { redirect } from '@tanstack/react-router';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes';
import { currentUserResource } from '#helpers/get-user.ts';
import { logger } from './logger';
import { forumUserClient } from '@repo/shared/api/forum-client';

async function validateSession (): Promise<boolean> {
  const res = await authClient["get-session"].$get();
  const data = await res.json();

  if (!data || "error" in data) return false;
  if (data.data) return true

  return false
}

export async function validateAdmin() {
  const res = await forumUserClient.user["get-is-admin"].$get()
  const data = await res.json()

  if (!data || "error" in data) return false;
  if (data.data) return true

  return false
}

export async function validatePage(ctx: Ctx, type: "redirect" | undefined = undefined): Promise<boolean> {
  let isAuthenticated: boolean = false;

  const cache = ctx.get(isAuthenticatedAtom);

  logger.info(`cache (isAuthenticated): ${cache}`)

  if (!cache) {
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