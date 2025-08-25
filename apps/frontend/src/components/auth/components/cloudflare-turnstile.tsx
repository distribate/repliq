import Turnstile from "react-turnstile"
import { reatomComponent } from "@reatom/npm-react"
import { tokenAtom, turnstileIsOpenAtom } from "../models/auth.model"

const SITE_KEY = import.meta.env.PUBLIC_ENV__TURNSTILE_KEY

export const CloudflareTurnstile = reatomComponent(({ ctx }) => {
  if (import.meta.env.DEV) return null;

  const state = ctx.spy(turnstileIsOpenAtom)
  if (!state) return null;

  return (
    <Turnstile
      sitekey={SITE_KEY}
      onVerify={token => tokenAtom(ctx, token)}
      className="self-end"
    />
  )
}, "CloudflareTurnstile")