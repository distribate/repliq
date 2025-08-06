import type { OnPageTransitionEndAsync } from "vike/types";
import { BProgress } from '@bprogress/core';

export const onPageTransitionEnd: OnPageTransitionEndAsync = async () => {
  BProgress.done()
};