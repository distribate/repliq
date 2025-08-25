import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";
import { Input } from "@repo/ui/src/components/input";
import { Typography } from "@repo/ui/src/components/typography";
import { toast } from "sonner";

const newEmailValueAtom = atom("", "newEmailValue");
const newEmailIsValidAtom = atom((ctx) => {
  return false
}, "newEmailIsValidAtom")

const emainChangeAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    
  })
}, {
  name: "emainChangeAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {

  }
}).pipe(withStatusesAtom())

const NewEmailInput = reatomComponent(({ ctx }) => {
  const isValid = ctx.spy(newEmailIsValidAtom);
  const isDisabled = !isValid || ctx.spy(emainChangeAction.statusesAtom).isPending;

  return (
    <Input
      value={ctx.spy(newEmailValueAtom)}
      onChange={e => newEmailValueAtom(ctx, e.target.value)}
      maxLength={128}
      disabled={isDisabled}
    />
  )
}, "NewEmailInput")

const EmailChangeButton = reatomComponent(({ctx}) => {
  return (
    <Button>
      <Typography className="text-lg font-semibold">
        Сохранить
      </Typography>
    </Button>
  )
}, "EmailChangeButton")

export const EmailChange = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 w-full">
      <Typography variant="dialogTitle">
        Смена почты
      </Typography>
      <div className="flex flex-col gap-y-2 w-full p-2">
        <Typography textSize="medium" textColor="shark_white">
          Для того чтобы сменить почту
        </Typography>
        <Typography textSize="medium">

        </Typography>
      </div>
    </div>
  );
}, "EmailChange")