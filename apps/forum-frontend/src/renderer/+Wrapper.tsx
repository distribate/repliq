import { PropsWithChildren } from "react"
import '@bprogress/core/css'
import "../global.css"

export default function Wrapper({ children }: PropsWithChildren) {
  return (
    <>
      {children}
    </>
  )
}