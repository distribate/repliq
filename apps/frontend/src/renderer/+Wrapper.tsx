import { PropsWithChildren } from "react"
import { ErrorBoundary } from "#shared/components/error-boundary"

import '@bprogress/core/css'
import "../global.css"

export default function Wrapper({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}