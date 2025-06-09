import { reatomComponent } from "@reatom/npm-react"
import { isProduction } from "@repo/lib/helpers/is-production"
import Turnstile from "react-turnstile"
import { tokenAtom, turnstileIsOpenAtom } from "../models/auth.model"

const SITE_KEY = "0x4AAAAAAA-stfNqE6yrheDS"

export const CloudflareTurnstile = reatomComponent(({ ctx }) => {
  const state = ctx.spy(turnstileIsOpenAtom) && isProduction

  if (!state) return null;

  return (
    <Turnstile
      sitekey={SITE_KEY}
      onVerify={token => tokenAtom(ctx, token)}
      className="self-end"
    />
  )
})