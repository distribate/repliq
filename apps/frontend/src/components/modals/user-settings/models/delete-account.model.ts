import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { sleep, withReset } from "@reatom/framework"
import { forumUserClient } from "#shared/forum-client"
import { toast } from "sonner"
import { toggleGlobalDialogAction } from "./user-settings.model"

export const deleteAccountIsAcceptedAtom = atom(false, "deleteAccountIsAccepted")
export const deleteAccountPasswordAtom = atom("", "password").pipe(withReset())

export const deleteAccountAction = reatomAsync(async (ctx) => {
  const password = ctx.get(deleteAccountPasswordAtom)

  if (!password) {
    throw new Error("Пароль не может быть пустым")
  }

  if (password.length <= 4) {
    throw new Error("Пароль должен быть больше 4 символов")
  }

  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["delete-account"].$post({ json: { password } })
    const data = await res.json()
    if ("error" in data) throw new Error(data.error)
    return data.status
  })
}, {
  name: "deleteAccountAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      if (e.message === 'Invalid password') {
        return toast.error("Неверный пароль")
      }

      toast.error(e.message)
    }
  },
  onFulfill: async (ctx, res) => {
    if (!res) return;

    deleteAccountPasswordAtom.reset(ctx)
    toggleGlobalDialogAction(ctx, { value: false, reset: true })

    toast.success("Аккаунт успешно удален", {
      description: "Через несколько секунд вы будете перенаправлены на главную страницу."
    })

    await sleep(3000)

    return ctx.schedule(() => window.location.reload())
  }
}).pipe(withStatusesAtom())