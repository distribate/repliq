import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog";
import { Textarea } from "@repo/ui/src/components/textarea";
import { NOTE_MAX_LENGTH, noteDialogIsOpenAtom, noteDialogOptionsAtom, noteValueAtom, setFriendNoteAction } from "../../../models/control-friend.model";
import { reatomComponent } from "@reatom/npm-react";

const NoteTextarea = reatomComponent(({ ctx }) => {
  return (
    <Textarea
      value={ctx.spy(noteValueAtom)}
      maxLength={NOTE_MAX_LENGTH}
      spellCheck={false}
      autoFocus={true}
      placeholder="Укажите заметку, например: коллега"
      onChange={e => noteValueAtom(ctx, e.target.value)}
      className="rounded-lg bg-shark-900 resize-none py-2 h-[56px] !text-[18px]"
    />
  )
}, "NoteTextarea")

const NoteLength = reatomComponent(({ ctx }) => {
  return (
    <Typography className="text-shark-300" textSize="small">
      {ctx.spy(noteValueAtom)?.length ?? 0}/{NOTE_MAX_LENGTH}
    </Typography>
  )
}, "NoteLength")

export const FriendControlNoteDialog = reatomComponent(({ ctx }) => {
  const noteDialogOptions = ctx.spy(noteDialogOptionsAtom)
  if (!noteDialogOptions) return;

  const handleNote = () => {
    setFriendNoteAction(ctx, {
      recipient: noteDialogOptions.nickname, friend_id: noteDialogOptions.friend_id
    })
  }

  const isDisabled = ctx.spy(setFriendNoteAction.statusesAtom).isPending

  return (
    <Dialog
      open={ctx.spy(noteDialogIsOpenAtom)}
      onOpenChange={value => noteDialogIsOpenAtom(ctx, value)}
    >
      <DialogContent>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <Typography variant="dialogTitle">
            Заметка для {noteDialogOptions.nickname}
          </Typography>
          <div className="flex flex-col gap-y-2 p-2 w-full">
            <NoteTextarea />
            <div className="flex w-full items-center justify-between gap-2">
              <NoteLength />
              <div className="flex items-center gap-2 w-fit">
                <Button
                  variant="positive"
                  disabled={isDisabled}
                  onClick={handleNote}
                >
                  <Typography>Сохранить</Typography>
                </Button>
                <DialogClose asChild>
                  <Button variant="negative">
                    <Typography>Отмена</Typography>
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}, "FriendCardControlNote")