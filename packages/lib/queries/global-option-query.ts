import { atom } from '@reatom/core';

type GlobalOption = {
  isStarted: boolean,
  isAuthenticated: boolean,
}

const initial = {
  isStarted: false,
  isAuthenticated: false
}

export const globalOptionsAtom = atom<GlobalOption>(initial, "globalOptions")