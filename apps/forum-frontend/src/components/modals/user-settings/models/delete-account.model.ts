import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { sleep } from "@reatom/framework"
import { forumUserClient } from "@repo/shared/api/forum-client"
import { toast } from "sonner"
import { toggleGlobalDialogAction } from "./user-settings.model"

export const deleteAccountIsAcceptedAtom = atom(false, "deleteAccountIsAccepted")
export const deleteAccountPasswordAtom = atom("", "password")

async function deleteAccount(password: string) {
  const res = await forumUserClient.user["delete-account"].$post({ json: { password } })
  const data = await res.json()
  return data
}

export const deleteAccountAction = reatomAsync(async (ctx) => {
  const password = ctx.get(deleteAccountPasswordAtom)

  if (!password) {
    throw new Error("Пароль не может быть пустым")
  }

  if (password.length <= 4) {
    throw new Error("Пароль должен быть больше 4 символов")
  }

  return await ctx.schedule(() => deleteAccount(password))
}, {
  name: "deleteAccountAction",
  onFulfill: async (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      if (res.error === 'Invalid password') {
        toast.error("Неверный пароль")
        return;
      }

      throw new Error(res.error)
    }

    deleteAccountPasswordAtom(ctx, "")

    toggleGlobalDialogAction(ctx, { value: false, reset: true })

    toast.success("Аккаунт успешно удален", {
      description: "Через несколько секунд вы будете перенаправлены на главную страницу."
    })

    await sleep(3000)

    return ctx.schedule(() => window.location.reload())
  },
  onReject: (_, err) => {
    if (err instanceof Error) {
      toast.error(err.message)
    }
  }
}).pipe(withStatusesAtom())