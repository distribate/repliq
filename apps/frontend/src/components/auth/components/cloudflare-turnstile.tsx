import Turnstile from "react-turnstile"
import { reatomComponent } from "@reatom/npm-react"
import { tokenAtom, turnstileIsOpenAtom } from "../models/auth.model"
import { isDevelopment, TURNSTILE_KEY } from "#shared/env"

export const CloudflareTurnstile = reatomComponent(({ ctx }) => {
  if (isDevelopment) return null;

  const state = ctx.spy(turnstileIsOpenAtom)
  if (!state) return null;

  return (
    <Turnstile
      sitekey={TURNSTILE_KEY}
      onVerify={token => tokenAtom(ctx, token)}
      className="self-end"
    />
  )
}, "CloudflareTurnstile")