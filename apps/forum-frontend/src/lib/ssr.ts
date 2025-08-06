import { IS_AUTHENTICATED_ATOM_KEY, isAuthenticatedAtom } from '#components/auth/models/auth.model';
import { atom } from '@reatom/core';
import { createMemStorage, reatomPersist } from '@reatom/persist'
import { PageContext } from 'vike/types';

export const ssrStorage = createMemStorage({ name: 'ssr', subscribe: false })
export const { snapshotAtom } = ssrStorage;

export const withSsr = reatomPersist(ssrStorage)

export const pageContextAtom = atom<PageContext | null>(null, "pageContext")

pageContextAtom.onChange((ctx, state) => {
  console.log(state)
  if (!state) return;

  const snapshot = state.snapshot ?? { };

  const target = snapshot[IS_AUTHENTICATED_ATOM_KEY]?.data as boolean ?? false

  if (target) {
    isAuthenticatedAtom(ctx, target)
  }

  snapshotAtom(ctx, snapshot)
})