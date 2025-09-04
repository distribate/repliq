import { IS_AUTHENTICATED_ATOM_KEY, isAuthenticatedAtom } from "#components/auth/models/auth.model";
import {
  CURRENT_USER_ATOM_KEY,
  currentUserAtom,
  USER_GLOBAL_OPTIONS_KEY,
  userGlobalOptionsAtom,
  userGlobalOptionsInitial
} from "#components/user/models/current-user.model";
import { atom, Ctx } from "@reatom/core";
import { PageContext } from "vike/types";
import { snapshotAtom } from "./ssr";

export const pageContextAtom = atom<PageContext | null>(null, "pageContext")

const SNAPSHOT_KEYS: Record<
  string,
  { atom: (ctx: Ctx, value: any) => void; fallback?: any }
> = {
  [IS_AUTHENTICATED_ATOM_KEY]: { atom: isAuthenticatedAtom, fallback: false },
  [USER_GLOBAL_OPTIONS_KEY]: { atom: userGlobalOptionsAtom, fallback: userGlobalOptionsInitial },
  [CURRENT_USER_ATOM_KEY]: { atom: currentUserAtom, fallback: null },
};

pageContextAtom.onChange((ctx, state) => {
  if (!state) return;

  const snapshot = state.snapshot ?? {};

  Object.entries(SNAPSHOT_KEYS).forEach(([key, { atom, fallback }]) => {
    const value = snapshot[key]?.data ?? fallback;

    console.log(key, ":", value);
    
    if (value !== undefined && value !== null) {
      atom(ctx, value);
    }
  });

  snapshotAtom(ctx, snapshot)
})