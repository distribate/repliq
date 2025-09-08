import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { atom, sleep } from "@reatom/framework"
import { toast } from "sonner"

export const alertFormTitle = atom("", "alertFormTitle")
export const alertFormDescAtom = atom("", "alertFormDesc")

export const updateAlertAction = reatomAsync(async (ctx) => {
  // todo: implement update alert
  return await ctx.schedule(() => sleep(200))
}, {
  name: "updateAlertAction",
  onFulfill: (_, __) => {
    toast.success("Сохранено")
  },
  onReject: (ctx, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error(e.message)
    }
  }
}).pipe(withStatusesAtom())
