import type { PageContextClient } from "vike/types";
import { BProgress } from '@bprogress/core';

export const onPageTransitionStart = async (pageContext: Partial<PageContextClient>) => {
  BProgress.start()
};