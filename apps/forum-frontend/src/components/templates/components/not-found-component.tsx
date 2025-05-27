import { NotFoundRouteProps } from "@tanstack/react-router"
import { lazy, Suspense } from "react"

const NotFound = lazy(() => import("#components/templates/components/not-found").then(m => ({ default: m.NotFound })))

export function NotFoundComponent({ data }: NotFoundRouteProps) {
  console.log(data)

  return (
    <Suspense>
      <NotFound />
    </Suspense>
  )
}
