import { reatomComponent } from "@reatom/npm-react"
import { isProduction } from "@repo/lib/helpers/is-production"
import Turnstile from "react-turnstile"
import { authTokenAtom } from "../models/auth.model"

const SITE_KEY = "0x4AAAAAAA-stfNqE6yrheDS"

export const CloudflareTurnstile = reatomComponent<{ isDirty: boolean }>(({ ctx, isDirty }) => {
  return (
    (isProduction && isDirty) && (
      <Turnstile
        sitekey={SITE_KEY}
        onVerify={token => authTokenAtom(ctx, token)}
        className="self-end"
      />
    )
  )
})