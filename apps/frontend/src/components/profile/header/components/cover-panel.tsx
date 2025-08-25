import { moreVariant } from "#ui/more-wrapper";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { BlockUserModal } from "#components/modals/action-confirmation/components/block-user/components/block-user-modal.tsx";
import { CoverImageUpdateModal } from "#components/profile/header/components/cover-image-update-modal";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Typography } from "@repo/ui/src/components/typography";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { requestedUserIsSameAtom, requestedUserParamAtom, requestedUserProfileBlockedAtom } from "#components/profile/main/models/requested-user.model";
import { UserProfileSettings } from "#components/user/components/settings/profile/components/user-profile-settings";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Ban, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { blockedUserAction, blockedUserDialogIsOpenAtom } from "#components/modals/action-confirmation/components/block-user/models/blocked-user.model";
import { X } from "lucide-react";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { deleteBackgroundImageAction, uploadBackgroundImageAction } from "#components/profile/header/models/cover-image.model.ts";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal.tsx";
import { IconPhotoFilled, IconSettings } from "@tabler/icons-react";
import { getUser } from "#components/user/models/current-user.model";
import { spawn } from "@reatom/framework";

const DeleteCoverModal = reatomComponent(({ ctx }) => {
  const cover_image = getUser(ctx).cover_image;
  if (!cover_image) return null;

  const handle = () => {
    void spawn(ctx, async (spawnCtx) => deleteBackgroundImageAction(spawnCtx))
  }

  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
      trigger={
        <div className="flex hover:bg-shark-600 rounded-md p-2 gap-2 items-center group">
          <X size={20} className="text-shark-300 group-hover:text-pink-500" />
          <Typography>Удалить фон</Typography>
        </div>
      }
      content={
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={handle}
            disabled={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
            pending={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
}, "DeleteCoverModal")

const ProfileProfileSettingsModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-1/2">
        <Button 
          title="Настройка профиля" 
          type="button" 
          className="rounded-l-none px-4 hover:bg-shark-800/50"
          >
          <IconSettings size={24} className="text-shark-300" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UserProfileSettings />
      </DialogContent>
    </Dialog>
  );
};

const ProfileBackgroundChangeModal = reatomComponent(({ ctx }) => {
  return (
    <>
      <DynamicModal
        autoClose
        withLoader
        isPending={ctx.spy(uploadBackgroundImageAction.statusesAtom).isPending || ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
        triggerClassName="w-1/2 h-full"
        trigger={
          <div className="flex items-center justify-center w-full h-full rounded-r-none px-4 hover:bg-shark-800/50">
            <IconPhotoFilled size={24} className="text-shark-300" />
          </div>
        }
        content={
          <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
            <Typography variant="dialogTitle">
              Фон профиля
            </Typography>
            <div className="flex flex-col gap-2 p-2 w-full gap-y-1">
              <CoverImageUpdateModal />
              <DeleteCoverModal />
            </div>
          </div>
        }
      />
    </>
  )
}, "ProfileBackgroundChangeModal")

const SyncTarget = ({ target }: { target: string }) => {
  useUpdate((ctx) => blockedUserAction(ctx, target), [target])
  return null;
}

const UserBlockedTrigger = reatomComponent(({ ctx }) => {
  const isBlocked = ctx.spy(blockedUserAction.dataAtom)

  return (
    <DropdownMenuItem onSelect={() => blockedUserDialogIsOpenAtom(ctx, true)} className="group gap-2">
      <Ban size={16} className="text-shark-300" />
      <Typography>
        {isBlocked === 'blocked-by-you' ? `Разблокировать` : `Заблокировать`}
      </Typography>
    </DropdownMenuItem>
  )
}, "UserBlockedTrigger")

export const UserCoverPanel = reatomComponent(({ ctx }) => {
  const requestedNickname = ctx.spy(requestedUserParamAtom)
  const isBlocked = ctx.spy(requestedUserProfileBlockedAtom)
  if (!requestedNickname) return null;

  const isOwner = ctx.spy(requestedUserIsSameAtom)

  if (isOwner) {
    return (
      <div className="flex items-center bg-shark-50/10 w-full backdrop-blur-lg h-10 rounded-md overflow-hidden">
        <ProfileBackgroundChangeModal />
        <ProfileProfileSettingsModal />
      </div>
    )
  }

  return (
    <>
      <SyncTarget target={requestedNickname} />
      <div className="flex items-center gap-2 justify-end lg:w-fit">
        {!isBlocked && (
          <FriendButton recipient={requestedNickname} />
        )}
        <BlockUserModal recipient={requestedNickname} />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={moreVariant({ size: "med" })}>
              <MoreVertical size={20} className="text-shark-300" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
              <UserBlockedTrigger />
              <Separator />
              <ReportCreateModal type="account" targetId={requestedNickname} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}, "UserCoverPanel")