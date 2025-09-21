import { Typography } from "@repo/ui/src/components/typography.tsx";
import { moreVariant } from "#ui/more-wrapper";
import { MoreVertical, Pen, Tag, Trash } from "lucide-react";
import { UserCardModal } from "#components/modals/custom/user-card-modal";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Friend } from "@repo/types/schemas/friend/friend-types.ts";
import { FriendControlNoteDialog } from "./friend-control-note";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { reatomComponent } from "@reatom/npm-react";
import { noteDialogIsOpenAtom, noteDialogOptionsAtom } from "#components/friend/models/control-friend.model";
import { Pin } from "lucide-react";
import { setFriendPinAction, setFriendUnpinAction } from "#components/friend/models/control-friend.model";
import { myFriendsPinnedDataAtom } from "#components/friends/models/friends.model";
import { removeFriendDialogIsOpenAtom, removeFriendOptionsAtom } from "#components/friend/models/control-friend-requests.model";
import { ConfirmationActionModalTemplate } from "#shared/components/confirmation-action-modal";
import { ConfirmationButton } from "#shared/components/confirmation-action-button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { removeFriendAction } from "#components/friend/models/control-friend-requests.model";
import { action, spawn } from "@reatom/framework";

type DeleteFriendModal = Pick<Friend, "friend_id" | "nickname">;

const DeleteFriendModal = reatomComponent(({ ctx }) => {
  const removeFriendOptions = ctx.spy(removeFriendOptionsAtom)
  if (!removeFriendOptions) return null;

  const handleDelete = () => {
    const { friend_id, nickname: recipient } = removeFriendOptions

    void spawn(ctx, async (spawnCtx) => removeFriendAction(spawnCtx, { friend_id, recipient }))
  }

  return (
    <Dialog
      open={ctx.spy(removeFriendDialogIsOpenAtom)}
      onOpenChange={value => removeFriendDialogIsOpenAtom(ctx, value)}
    >
      <DialogContent>
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={handleDelete}
            disabled={ctx.spy(removeFriendAction.statusesAtom).isPending}
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={ctx.spy(removeFriendAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      </DialogContent>
    </Dialog>
  );
}, "DeleteFriendModal")

type FriendControlProps = Pick<Friend, "friend_id" | "nickname" | "is_pinned">;

const selectTargetToNoteAction = action((ctx, { nickname, friend_id }: Omit<FriendControlProps, "is_pinned">) => {
  noteDialogOptionsAtom(ctx, { friend_id, nickname })
  noteDialogIsOpenAtom(ctx, true)
}, "selectTargetToNoteAction")

const FriendControlNoteTrigger = reatomComponent<Omit<FriendControlProps, "is_pinned">>(({ ctx, friend_id, nickname }) => {
  const handle = () => selectTargetToNoteAction(ctx, { friend_id, nickname })

  return (
    <DropdownMenuItem onSelect={handle} className="px-2 py-1.5 gap-2">
      <Pen size={16} className="text-shark-300" />
      <Typography textSize="medium">
        Добавить заметку
      </Typography>
    </DropdownMenuItem>
  )
}, "FriendControlNoteTrigger")

const togglePinAction = action((ctx, { nickname: recipient, friend_id, is_pinned }: FriendControlProps) => {
  const payload = { recipient, friend_id };

  void spawn(ctx, async (spawnCtx) => is_pinned
    ? setFriendUnpinAction(spawnCtx, payload)
    : setFriendPinAction(spawnCtx, payload)
  )
}, "togglePinAction")

const FriendControlPinTrigger = reatomComponent<FriendControlProps>(({
  ctx, is_pinned, nickname, friend_id
}) => {
  const handle = () => togglePinAction(ctx, { nickname, friend_id, is_pinned })

  const isDisabled = ctx.spy(myFriendsPinnedDataAtom).length >= 1 && !is_pinned

  return (
    <DropdownMenuItem
      onClick={handle}
      disabled={isDisabled}
      className="gap-2 group"
    >
      <Pin size={16} className="text-shark-300" />
      {is_pinned ? (
        <Typography textSize="medium" className="text-green-500">
          Открепить
        </Typography>
      ) : (
        <Typography textSize="medium">Закрепить</Typography>
      )}
    </DropdownMenuItem>
  );
}, "FriendControlPinTrigger")

const selectTargetToDeleteAction = action((ctx, { nickname, friend_id }: Omit<FriendControlProps, "is_pinned">) => {
  removeFriendOptionsAtom(ctx, { nickname, friend_id })
  removeFriendDialogIsOpenAtom(ctx, true)
}, "deleteFriendAction")

const FriendControlDeleteTrigger = reatomComponent<Omit<FriendControlProps, "is_pinned">>(({
  ctx, nickname, friend_id
}) => {
  const handle = () => selectTargetToDeleteAction(ctx, { friend_id, nickname });

  return (
    <DropdownMenuItem onSelect={handle} className="px-2 py-1.5 gap-2" >
      <Trash size={16} className="text-red-500" />
      <Typography textSize="medium" className="text-red-500">
        Удалить из друзей
      </Typography>
    </DropdownMenuItem>
  )
}, "FriendControlDeleteTrigger")

export const FriendControlMore = ({ nickname, friend_id, is_pinned }: FriendControlProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className={moreVariant({ size: "large" })}>
          <MoreVertical size={20} className="text-shark-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <UserCardModal
          nickname={nickname}
          withCustomTrigger={true}
          trigger={
            <DropdownMenuItem
              className="flex px-2 py-1.5 focus:bg-shark-600 hover:bg-shark-700 rounded-md 
                transition-all duration-300 ease-in-out justify-start items-center gap-2 group"
            >
              <Tag size={16} className="text-shark-300" />
              <Typography textSize="medium">
                Показать карточку профиля
              </Typography>
            </DropdownMenuItem>
          }
        />
        <FriendControlPinTrigger nickname={nickname} friend_id={friend_id} is_pinned={is_pinned} />
        <FriendControlNoteTrigger nickname={nickname} friend_id={friend_id} />
        <Separator />
        <FriendControlDeleteTrigger nickname={nickname} friend_id={friend_id} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const FriendControl = ({ nickname, friend_id, is_pinned }: FriendControlProps) => {
  return (
    <>
      <FriendControlNoteDialog />
      <DeleteFriendModal />
      <FriendControlMore nickname={nickname} friend_id={friend_id} is_pinned={is_pinned} />
    </>
  );
};