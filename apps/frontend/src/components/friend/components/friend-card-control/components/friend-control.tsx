import { Typography } from "@repo/ui/src/components/typography.tsx";
import { moreVariant } from "#ui/more-wrapper";
import { MoreVertical, Pen, Tag, Trash } from "lucide-react";
import { UserCardModal } from "#components/modals/custom/components/user-card-modal.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Friend } from "@repo/types/schemas/friend/friend-types.ts";
import { FriendControlNoteDialog } from "./friend-control-note";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { reatomComponent } from "@reatom/npm-react";
import { noteDialogIsOpenAtom, noteDialogOptionsAtom } from "#components/friend/models/control-friend.model";
import { Pin } from "lucide-react";
import { setFriendPinAction, setFriendUnpinAction } from "#components/friend/models/control-friend.model";
import { myFriendsPinnedDataAtom } from "#components/friends/models/friends.model";
import { removeFriendIsOpenAtom, removeFriendOptionsAtom } from "#components/friend/models/control-friend-requests.model";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { removeFriendAction } from "#components/friend/models/control-friend-requests.model";

type DeleteFriendModal = Pick<Friend, "friend_id" | "nickname">;

const DeleteFriendModal = reatomComponent(({ ctx }) => {
  const removeFriendOptions = ctx.spy(removeFriendOptionsAtom)
  if (!removeFriendOptions) return null;

  const handleDelete = () => {
    removeFriendAction(ctx, {
      friend_id: removeFriendOptions.friend_id, recipient: removeFriendOptions.nickname
    })
  }

  return (
    <Dialog open={ctx.spy(removeFriendIsOpenAtom)} onOpenChange={value => removeFriendIsOpenAtom(ctx, value)}>
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

const FriendControlNoteTrigger = reatomComponent<Omit<FriendControlProps, "is_pinned">>(({ ctx, friend_id, nickname }) => {
  const handleOpen = () => {
    noteDialogOptionsAtom(ctx, { friend_id, nickname })
    noteDialogIsOpenAtom(ctx, true)
  }

  return (
    <DropdownMenuItem onSelect={handleOpen} className="px-2 py-1.5 gap-2">
      <Pen size={16} className="text-shark-300" />
      <Typography textSize="medium">
        Добавить заметку
      </Typography>
    </DropdownMenuItem>
  )
}, "FriendControlNoteTrigger")

const FriendControlPinTrigger = reatomComponent<FriendControlProps>(({
  ctx, is_pinned, nickname: recipient, friend_id
}) => {
  const handlePin = () => {
    if (is_pinned) {
      setFriendUnpinAction(ctx, { recipient, friend_id });
    } else {
      setFriendPinAction(ctx, { recipient, friend_id });
    }
  };

  return (
    <DropdownMenuItem
      onClick={handlePin}
      disabled={ctx.spy(myFriendsPinnedDataAtom).length >= 1 && !is_pinned}
      className="gap-2 group"
    >
      <Pin size={16} className="text-shark-300" />
      {is_pinned ? (
        <Typography textSize="medium" className="text-caribbean-green-500">
          Открепить
        </Typography>
      ) : (
        <Typography textSize="medium">Закрепить</Typography>
      )}
    </DropdownMenuItem>
  );
}, "FriendControlPinTrigger")

const FriendControlDeleteTrigger = reatomComponent<Omit<FriendControlProps, "is_pinned">>(({
  ctx, nickname, friend_id
}) => {
  const handleOpen = () => {
    removeFriendOptionsAtom(ctx, { nickname, friend_id })
    removeFriendIsOpenAtom(ctx, true)
  };

  return (
    <DropdownMenuItem onSelect={handleOpen} className="px-2 py-1.5 gap-2">
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
            <div className="flex px-2 py-1.5 focus:bg-shark-600 hover:bg-shark-700 rounded-md 
            transition-all duration-300 ease-in-out justify-start items-center gap-2 group">
              <Tag size={16} className="text-shark-300" />
              <Typography textSize="medium">
                Показать карточку профиля
              </Typography>
            </div>
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