import { reatomComponent } from "@reatom/npm-react"
import { isAuthenticatedAtom } from '#components/auth/models/auth.model';
import { LatestCommentsSkeleton } from '#components/templates/components/main-page-skeleton';
import { lazy, Suspense } from 'react';
import { Alerts } from "#components/layout/components/default/alerts";
import { MainCategories } from "#components/categories/components/main/components/main-categories-list";
import { isExperimentalDesignAtom } from "#components/layout/components/default/experimental-layout";

const Comments = lazy(() => import('#components/layout/components/widgets/latest-comments/latest-comments').then((m) => ({ default: m.LatestComments })))

const LatestComments = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    <Suspense fallback={<LatestCommentsSkeleton />}>
      <Comments />
    </Suspense>
  )
}, "LatestComments")

const Home = reatomComponent(({ ctx }) => {
  return (
    <main className="flex flex-col w-full gap-2 h-full">
      <Alerts />
      <div className="flex xl:flex-row gap-2 flex-col w-full h-full">
        <div data-state={ctx.spy(isExperimentalDesignAtom)} className="flex flex-col w-full data-[state=false]:xl:w-3/4 gap-2 h-full">
          <MainCategories />
          {!ctx.spy(isExperimentalDesignAtom) && (
            <div className="xl:hidden flex flex-col gap-2 w-full xl:w-1/4 h-full">
              <LatestComments />
            </div>
          )}
        </div>
        {!ctx.spy(isExperimentalDesignAtom) && (
          <div className="hidden xl:flex flex-col gap-2 w-full xl:w-1/4 h-full">
            <LatestComments />
          </div>
        )}
      </div>
    </main>
  )
}, "Home")

export default function HomePage() {
  return <Home />
}