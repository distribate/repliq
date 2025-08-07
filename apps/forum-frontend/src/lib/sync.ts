import { IS_AUTHENTICATED_ATOM_KEY, isAuthenticatedAtom } from "#components/auth/models/auth.model";
import {
  CURRENT_USER_ATOM_KEY,
  currentUserAtom,
  USER_GLOBAL_OPTIONS_KEY,
  userGlobalOptionsAtom,
  userGlobalOptionsInitial
} from "#components/user/models/current-user.model";
import { atom, AtomState } from "@reatom/core";
import { PageContext } from "vike/types";
import { snapshotAtom } from "./ssr";

export const pageContextAtom = atom<PageContext | null>(null, "pageContext")

pageContextAtom.onChange((ctx, state) => {
  if (!state) return;

  const snapshot = state.snapshot ?? {};

  const isAuthenticated = snapshot[IS_AUTHENTICATED_ATOM_KEY]?.data as boolean ?? false
  const userGlobalOpts = snapshot[USER_GLOBAL_OPTIONS_KEY]?.data as typeof userGlobalOptionsInitial ?? userGlobalOptionsInitial
  const currentUser = snapshot[CURRENT_USER_ATOM_KEY]?.data as AtomState<typeof currentUserAtom> ?? null

  if (isAuthenticated) {
    isAuthenticatedAtom(ctx, isAuthenticated)
  }

  if (userGlobalOpts) {
    userGlobalOptionsAtom(ctx, userGlobalOpts)
  }

  if (currentUser) {
    currentUserAtom(ctx, currentUser)
  }

  snapshotAtom(ctx, snapshot)
})