import type { OnPageTransitionStartAsync } from "vike/types";
import { BProgress } from '@bprogress/core';

export const onPageTransitionStart: OnPageTransitionStartAsync = async () => {
  BProgress.start()
};