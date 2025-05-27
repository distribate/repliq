import { authPasswordVisibilityAtom, PasswordVisiblity } from "../models/auth.model";
import EnderPearl from "@repo/assets/images/minecraft/ender_pearl.webp";
import EyeOfEnder from "@repo/assets/images/minecraft/eye_of_ender.webp";
import { reatomComponent } from "@reatom/npm-react";

const PASSWORD_MAP: Record<PasswordVisiblity, string> = {
  "text": EyeOfEnder,
  "password": EnderPearl
}

export const PasswordVisibilityBadge = reatomComponent(({ ctx }) => {
  return (
    <img
      className="cursor-pointer"
      src={PASSWORD_MAP[ctx.spy(authPasswordVisibilityAtom)]}
      alt=""
      width={36}
      height={36}
      loading="lazy"
      onClick={() => {
        authPasswordVisibilityAtom(ctx, (state) => state === "password" ? "text" : "password")
      }}
    />
  )
}, "PasswordVisibilityBadge")