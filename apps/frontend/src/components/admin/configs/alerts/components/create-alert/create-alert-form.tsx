import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { createAlertDescriptionAtom, createAlertTitleAtom } from "../../models/create-alert.model";

const CreateAlertTitle = reatomComponent(({ ctx }) => {
  return (
    <Input
      maxLength={100}
      placeholder="Заголовок"
      roundedType="default"
      value={ctx.spy(createAlertTitleAtom)}
      onChange={(e) => createAlertTitleAtom(ctx, e.target.value)}
    />
  )
}, 'CreateAlertTitle')

const CreateAlertDescription = reatomComponent(({ ctx }) => {
  return (
    <Input
      maxLength={256}
      placeholder="Описание"
      roundedType="default"
      value={ctx.spy(createAlertDescriptionAtom)}
      onChange={e => createAlertDescriptionAtom(ctx, e.target.value)}
    />
  )
}, "CreateAlertDescription")

const isValidAtom = atom((ctx) => ctx.spy(createAlertTitleAtom).length >= 2, "createAlertIsValid")

const CreateAlertButton = reatomComponent(({ ctx }) => {
  const isDisabled = !ctx.spy(isValidAtom);

  return (
    <Button
      onClick={() => { }}
      variant="positive"
      className="w-full"
      disabled={isDisabled}
    >
      <Typography>Создать</Typography>
    </Button>
  )
}, "CreateAlertButton")

export const CreateAlertForm = () => {
  return (
    <>
      <div className="flex flex-col w-full gap-2">
        <CreateAlertTitle />
        <CreateAlertDescription />
      </div>
      <div className="flex items-center pb-2 gap-2 *:w-full w-full">
        <CreateAlertButton />
        <DialogClose>
          <Button variant="negative" className="w-full">
            <Typography>Отмена</Typography>
          </Button>
        </DialogClose>
      </div>
    </>
  );
};