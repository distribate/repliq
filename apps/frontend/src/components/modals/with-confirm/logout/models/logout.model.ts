import { validateResponse } from "#shared/api/validation";
import { authClient } from "#shared/api/auth-client";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { toast } from "sonner";

export const logoutModalIsOpenAtom = atom(false, "logoutModalIsOpen")

export const logoutAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await authClient["invalidate-session"].$post();

    return validateResponse<typeof res>(res)
  });
}, {
  name: "logoutAction",
  onReject: (e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    logoutModalIsOpenAtom(ctx, false)

    return ctx.schedule(() => window.location.reload())
  }
}).pipe(withStatusesAtom())