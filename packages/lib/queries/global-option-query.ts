import { atom } from '@reatom/core';

const initial = {
  isStarted: false,
  isAuthenticated: false
}

export const isAuthenticatedAtom = atom<boolean>(initial.isAuthenticated, "isAuthenticated")
export const isStartedAtom = atom<boolean>(initial.isStarted, "isStarted")