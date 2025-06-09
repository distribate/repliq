import { LatestCommentsSkeleton } from '#components/templates/components/main-page-skeleton';
import { reatomComponent } from '@reatom/npm-react';
import { isAuthenticatedAtom } from '@repo/lib/queries/global-option-query';
import { lazy, Suspense } from 'react';

const Comments = lazy(() => import('#components/layout/components/stats/latest-comments').then((m) => ({ default: m.LatestComments })))

export const LatestComments = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    <Suspense fallback={<LatestCommentsSkeleton />}>
      <Comments />
    </Suspense>
  )
}, "LatestComments")