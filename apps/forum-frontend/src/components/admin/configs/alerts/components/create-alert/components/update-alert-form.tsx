import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { action, atom } from "@reatom/core";
import { reatomAsync, sleep, withConcurrency, withStatusesAtom } from "@reatom/framework";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { AlertValues } from "./create-alert-form";
import { toast } from "sonner";

const alertFormTitle = atom("", "alertFormTitle")
const alertFormDescAtom = atom("", "alertFormDesc")
const alertFormLinkAtom = atom("", "alertFormLink")

const MAP = {
  title: alertFormTitle,
  desc: alertFormDescAtom,
  link: alertFormLinkAtom
} as const

const onChange = action(async (ctx, type: keyof typeof MAP, e: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;

  await ctx.schedule(() => sleep(300))

  const target = MAP[type]

  target(ctx, value)
}).pipe(withConcurrency())

const updateAlertAction = reatomAsync(async (ctx) => {
  // todo: implement update alert
  return await ctx.schedule(() => sleep(200))
}, {
  name: "updateAlertAction",
  onFulfill: (_, __) => {
    toast.success("Сохранено")
  }
}).pipe(withStatusesAtom())

const SyncOldState = ({ title, description, link }: AlertValues) => {
  useUpdate((ctx) => {
    alertFormTitle(ctx, title);

    if (description) {
      alertFormDescAtom(ctx, description)
    }

    if (link) {
      alertFormLinkAtom(ctx, link)
    }
  }, [])

  return null;
}

export const AlertUpdateForm = reatomComponent<Omit<AlertEntity, "created_at" | "creator">>(({
  ctx, description, link, title,
}) => {
  const isDisabled = false;

  return (
    <>
      <SyncOldState title={title} description={description} link={link} />
      <div className="flex flex-col w-full gap-2">
        <Input
          maxLength={100}
          placeholder="Заголовок"
          roundedType="default"
          onChange={e => onChange(ctx, "title", e)}
        />
        <Input
          maxLength={256}
          placeholder="Описание"
          roundedType="default"
          onChange={e => onChange(ctx, "title", e)}
        />
        <Input
          maxLength={256}
          placeholder="Ссылка"
          roundedType="default"
          onChange={e => onChange(ctx, "link", e)}
        />
      </div>
      <div className="flex items-center pb-2 gap-2 *:w-full w-full">
        <Button
          onClick={() => updateAlertAction(ctx)}
          variant="positive"
          className="w-full"
          disabled={isDisabled}
        >
          <Typography>Создать</Typography>
        </Button>
        <DialogClose>
          <Button variant="negative" className="w-full">
            <Typography>Отмена</Typography>
          </Button>
        </DialogClose>
      </div>
    </>
  );
}, "AlertUpdateForm")