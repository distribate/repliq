import { authPasswordVisibilityAtom } from "../models/auth.model";
import { reatomComponent } from "@reatom/npm-react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordVisibilityBadge = reatomComponent(({ ctx }) => {
  return ctx.spy(authPasswordVisibilityAtom) === 'text' ? (
    <EyeOff size={20} className='text-shark-300 cursor-pointer' onClick={() => authPasswordVisibilityAtom(ctx, "password")} />
  ) : (
    <Eye size={20} className='text-shark-300 cursor-pointer' onClick={() => authPasswordVisibilityAtom(ctx, "text")} />
  )
}, "PasswordVisibilityBadge")