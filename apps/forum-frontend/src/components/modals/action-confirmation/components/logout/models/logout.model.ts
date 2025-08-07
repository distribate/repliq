import { toast } from "sonner";
import { authClient } from "#shared/auth-client";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";

async function deleteSession() {
  const res = await authClient["invalidate-session"].$post();
  const data = await res.json();

  if ("error" in data) {
    throw new Error(data.error);
  }

  return data;
}

export const logoutModalIsOpenAtom = atom(false, "logoutModalIsOpen")

export const logoutAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => deleteSession());
}, {
  name: "logoutAction",
  onFulfill: (ctx, res) => {
    if (!res.status) {
      return toast.error("Произошла ошибка");
    }
    
    logoutModalIsOpenAtom(ctx, false)

    return ctx.schedule(() => window.location.reload())
  },
  onReject: (e) => {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}).pipe(withStatusesAtom())