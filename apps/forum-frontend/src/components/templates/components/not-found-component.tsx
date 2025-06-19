import { lazy, Suspense } from "react"

const NotFound = lazy(() => import("#components/templates/components/not-found").then(m => ({ default: m.NotFound })))

export function NotFoundComponent() {
  return (
    <Suspense>
      <NotFound />
    </Suspense>
  )
}
