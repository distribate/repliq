import type { PageContextClient } from "vike/types";
import { BProgress } from '@bprogress/core';

export const onPageTransitionEnd = async (pageContext: PageContextClient) => {
  BProgress.done()
};