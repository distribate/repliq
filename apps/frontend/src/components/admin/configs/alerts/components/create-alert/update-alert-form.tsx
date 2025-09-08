import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { action } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { AlertsPayloadData } from "#shared/models/alerts.model";
import { alertFormDescAtom, alertFormTitle, updateAlertAction } from "../../models/update-alert.model";

const MAP = {
  title: alertFormTitle,
  desc: alertFormDescAtom,
} as const

const onChange = action(async (ctx, type: keyof typeof MAP, e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const atom = MAP[type]

  await ctx.schedule(() => sleep(300))

  atom(ctx, value)
}, "updateAlertOnChange").pipe(withConcurrency())

type AlertEditable = Pick<AlertsPayloadData[number], "title" | "description">

const Sync = ({ title, description }: AlertEditable) => {
  useUpdate((ctx) => {
    alertFormTitle(ctx, title);

    description && alertFormDescAtom(ctx, description)
  }, [])

  return null;
}

type AlertUpdateFormProps = Omit<AlertsPayloadData[number], "created_at" | "creator">

const AlertUpdateTitle = reatomComponent(({ ctx }) => {
  return (
    <Input
      maxLength={100}
      placeholder="Заголовок"
      roundedType="default"
      onChange={e => onChange(ctx, "title", e)}
    />
  )
}, "AlertUpdateTitle")

const AlertUpdateDesc = reatomComponent(({ ctx }) => {
  return (
    <Input
      maxLength={256}
      placeholder="Описание"
      roundedType="default"
      onChange={e => onChange(ctx, "title", e)}
    />
  )
}, "AlertUpdateDesc")

export const AlertUpdateForm = reatomComponent<AlertUpdateFormProps>(({
  ctx, description, title
}) => {
  const isDisabled = false;

  return (
    <>
      <Sync title={title} description={description} />
      <div className="flex flex-col w-full gap-2">
        <AlertUpdateTitle />
        <AlertUpdateDesc />
      </div>
      <div className="flex items-center pb-2 gap-2 *:w-full w-full">
        <Button
          onClick={() => updateAlertAction(ctx)}
          variant="positive"
          className="w-full"
          disabled={isDisabled}
        >
          <Typography className="font-semibold text-lg">
            Сохранить
          </Typography>
        </Button>
        <DialogClose asChild>
          <Button variant="negative" className="w-full">
            <Typography className="font-semibold text-lg">
              Отмена
            </Typography>
          </Button>
        </DialogClose>
      </div>
    </>
  );
}, "AlertUpdateForm")