import { atom } from "@reatom/core";

type Cover = {
  inView: boolean
};

const initial: Cover = {
  inView: true
};

export const coverAtom = atom<Cover>(initial, "cover")