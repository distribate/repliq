import { lazy, Suspense } from "react";

const Error = lazy(() => import("#components/templates/components/error").then(m => ({ default: m.ErrorComponent })))

export function ErrorComponent({ error, reset }: any) {
  return (
    <Suspense>
      <Error error={error} reset={reset} />
    </Suspense>
  )
}