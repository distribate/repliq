import { reatomComponent } from '@reatom/npm-react'
import { useSeoMeta } from "@unhead/react";
import { wrapTitle } from "@repo/lib/utils/wrap-title";
import { PATHNAME } from "@repo/shared/constants/meta";
import { lazy, Suspense } from 'react';
import { RouteSkeleton } from '#components/templates/components/route-skeleton';
import { isAuthenticatedAtom } from '#components/auth/models/auth.model';

const PrivateVariant = lazy(() => import("#components/layout/components/default/private-variant").then(m => ({ default: m.PrivateVariant })))
const PublicVariant = lazy(() => import("#components/layout/components/default/public-index").then(m => ({ default: m.PublicVariant })))

const IndexHead = () => {
  useSeoMeta({
    title: wrapTitle("Главная"),
    description: "Fasberry - майнкрафт сервер",
    ogTitle: wrapTitle("Главная"),
    ogDescription: "Fasberry - майнкрафт сервер",
    ogUrl: PATHNAME,
    twitterTitle: wrapTitle("Главная"),
    twitterDescription: "Fasberry - майнкрафт сервер",
    ogImage: { url: "https://static.fasberry.su/v1/object/public/static/auth_background/5.png", width: 1200, height: 600, alt: 'image', type: 'image/png' },
    twitterImage: { url: "https://static.fasberry.su/v1/object/public/static/auth_background/5.png", width: 1200, height: 600, alt: 'image', type: 'image/png' }
  })

  return null
}

export const IndexRouteComponent = reatomComponent(({ ctx }) => {
  return (
    <>
      <IndexHead />
      {ctx.spy(isAuthenticatedAtom) ? (
        <Suspense fallback={<RouteSkeleton />}>
          <PrivateVariant />
        </Suspense>
      ) : (
        <Suspense fallback={<RouteSkeleton />}>
          <PublicVariant />
        </Suspense>
      )}
    </>
  )
}, "IndexRouteComponent")