import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";

type AlertEntity = {
  id: number,
  link: string | null,
  creator: {
    nickname: string,
    avatar: string | null
  }
  created_at: string | Date,
  title: string,
  description: string | null
}

export type AlertValues = Pick<AlertEntity, "title" | "description" | "link">;

const alertTitleAtom = atom<string>("", "alertTitle")
const alertDescriptionAtom = atom<string>("", "alertDescription")
const alertLinkAtom = atom<string | null>(null, "alertLink")

const CreateAlertTitle = reatomComponent(({ ctx }) => {
  return (
    <Input
      maxLength={100}
      placeholder="Заголовок"
      roundedType="default"
      value={ctx.spy(alertTitleAtom)}
      onChange={(e) => alertTitleAtom(ctx, e.target.value)}
    />
  )
}, 'CreateAlertTitle')

const CreateAlertDescription = reatomComponent(({ ctx }) => {
  return (
    <Input
      maxLength={256}
      placeholder="Описание"
      roundedType="default"
      value={ctx.spy(alertDescriptionAtom)}
      onChange={e => alertDescriptionAtom(ctx, e.target.value)}
    />
  )
}, "CreateAlertDescription")

const CreateAlertLink = reatomComponent(({ ctx }) => {
  return (
    <Input
      maxLength={256}
      placeholder="Ссылка"
      roundedType="default"
      value={ctx.spy(alertLinkAtom) ?? ""}
      onChange={e => alertLinkAtom(ctx, e.target.value)}
    />
  )
}, "CreateAlertLink")

const isValidAtom = atom((ctx) => {
  const title = ctx.spy(alertTitleAtom)

  return title.length >= 2
}, "isValid")

const CreateAlertButton = reatomComponent(({ctx}) => {
  const isDisabled = !ctx.spy(isValidAtom);

  return (
    <Button
      onClick={() => {}}
      variant="positive"
      className="w-full"
      disabled={isDisabled}
    >
      <Typography>Создать</Typography>
    </Button>
  )
}, "CreateAlertButton")

export const AlertCreateForm = () => {
  return (
    <>
      <div className="flex flex-col w-full gap-2">
        <CreateAlertTitle />
        <CreateAlertDescription />
        <CreateAlertLink />
      </div>
      <div className="flex items-center pb-2 gap-2 *:w-full w-full">
        <CreateAlertButton/>
        <DialogClose>
          <Button variant="negative" className="w-full">
            <Typography>Отмена</Typography>
          </Button>
        </DialogClose>
      </div>
    </>
  );
};
