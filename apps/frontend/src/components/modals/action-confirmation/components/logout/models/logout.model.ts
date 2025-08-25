import { authClient } from "#shared/auth-client";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { toast } from "sonner";

export const logoutModalIsOpenAtom = atom(false, "logoutModalIsOpen")

export const logoutAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await authClient["invalidate-session"].$post();
    const data = await res.json();

    if ("error" in data) throw new Error(data.error);

    return data.status;
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