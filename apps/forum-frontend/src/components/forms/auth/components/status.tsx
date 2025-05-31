import { reatomComponent } from "@reatom/npm-react";
import { authStatusMessageAtom, authStatusTypeAtom } from "../models/auth.model";

export const AuthStatus = reatomComponent(({ ctx }) => {
  return (
    <span
      data-state={ctx.spy(authStatusTypeAtom)}
      className="data-[state=positive]:text-green-600 data-[state=negative]:text-red-600"
    >
      {ctx.spy(authStatusMessageAtom)}
    </span>
  )
})