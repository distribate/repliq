import { createCtx, Ctx } from "@reatom/core"
import { useRef } from "react"

export const isSsr = typeof window === 'undefined'

export interface Fn<Args extends any[] = any[], Return = any> {
  (...a: Args): Return
}

export const useCreateCtx = (extension?: Fn<[Ctx]>) => {
  const ctxRef = useRef(null as null | Ctx)

  if (!ctxRef.current) {
    ctxRef.current = createCtx({ restrictMultipleContexts: false })

    extension?.(ctxRef.current)
  }

  return ctxRef.current
}