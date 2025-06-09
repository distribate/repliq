import { reatomComponent } from "@reatom/npm-react"
import { Button } from "@repo/ui/src/components/button"
import { Input } from "@repo/ui/src/components/input"
import { Typography } from "@repo/ui/src/components/typography"
import { spawn } from "@reatom/framework"
import { deleteAccountAction, deleteAccountIsAcceptedAtom, deleteAccountPasswordAtom } from "../../../../modals/user-settings/models/delete-account.model"

const DeleteAccountPasswordInput = reatomComponent(({ ctx }) => {
  return (
    <Input
      className="w-full"
      type="password"
      placeholder="Введите пароль"
      value={ctx.spy(deleteAccountPasswordAtom)}
      onChange={(e) => deleteAccountPasswordAtom(ctx, e.target.value)}
    />
  )
}, "DeleteAccountPasswordInput")

export const DeleteAccount = reatomComponent(({ ctx }) => {
  const handleDelete = () => {
    void spawn(ctx, async (spawnCtx) => deleteAccountAction(spawnCtx))
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 w-full">
      <Typography variant="dialogTitle">
        Удаление аккаунта
      </Typography>
      <div className="flex flex-col gap-4 w-full p-2">
        <div className="flex flex-col">
          <Typography textSize="medium" textColor="gray">
            Восстановить аккаунт возможно в течении следующих 90 дней.
          </Typography>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {ctx.spy(deleteAccountIsAcceptedAtom) ? (
            <>
              <DeleteAccountPasswordInput />
              <div className="flex gap-2">
                <Button onClick={handleDelete} variant="positive">
                  <Typography textSize="medium">
                    Удалить аккаунт
                  </Typography>
                </Button>
                <Button onClick={() => deleteAccountIsAcceptedAtom(ctx, false)} state="default">
                  <Typography textSize="medium">
                    Отмена
                  </Typography>
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={() => deleteAccountIsAcceptedAtom(ctx, true)} className="bg-shark-50  self-end">
              <Typography textSize="medium" className="text-shark-900">
                Я хочу удалить аккаунт
              </Typography>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}, "DeleteAccount")