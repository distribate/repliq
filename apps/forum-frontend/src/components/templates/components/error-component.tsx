import { ErrorComponentProps } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Error = lazy(() => import("#components/layout/components/default/error").then(m => ({ default: m.ErrorComponent })))

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <Suspense>
      <Error error={error} reset={reset} />
    </Suspense>
  )
}