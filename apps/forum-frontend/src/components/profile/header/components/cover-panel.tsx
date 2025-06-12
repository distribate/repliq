import { MoreWrapper } from "#components/wrappers/components/more-wrapper";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { BlockUserModal } from "#components/modals/action-confirmation/components/block-user/components/block-user-modal.tsx";
import { CoverImageUpdateModal } from "#components/profile/header/components/cover-image-update-modal";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Typography } from "@repo/ui/src/components/typography";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { requestedUserIsSameAtom, requestedUserParamAtom, requestedUserProfileBlockedAtom } from "#components/profile/main/models/requested-user.model";
import { UserProfileSettings } from "#components/user/settings/profile/components/user-profile-settings";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Ban } from "lucide-react";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu";
import { blockedUserAction, blockedUserDialogIsOpenAtom } from "#components/modals/action-confirmation/components/block-user/models/blocked-user.model";
import { X } from "lucide-react";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { deleteBackgroundImageAction } from "#components/profile/header/models/cover-image.model.ts";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal.tsx";
import { IconPhotoFilled, IconSettings } from "@tabler/icons-react";
import { getUser } from "#components/user/models/current-user.model";

const DeleteCoverModal = reatomComponent(({ ctx }) => {
  const cover_image = getUser(ctx).cover_image;
  if (!cover_image) return null;

  return (
    <DynamicModal
      autoClose
      isPending={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
      withLoader
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
            onClick={() => deleteBackgroundImageAction(ctx)}
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
        <Button title="Настройка профиля" type="button" className="rounded-l-none px-4 hover:bg-shark-800/50">
          <IconSettings size={24} className="text-shark-200" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UserProfileSettings />
      </DialogContent>
    </Dialog>
  );
};

const ProfileBackgroundChangeModal = () => {
  return (
    <Dialog>
      <DialogTrigger className="w-1/2 h-full">
        <div className="flex items-center justify-center w-full h-full rounded-r-none px-4 hover:bg-shark-800/50">
          <IconPhotoFilled size={24} className="text-shark-200" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
          <Typography variant="dialogTitle">
            Фон профиля
          </Typography>
          <div className="flex flex-col gap-2 p-2 w-full gap-y-1">
            <CoverImageUpdateModal />
            <DeleteCoverModal />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
})

export const UserCoverPanel = reatomComponent(({ ctx }) => {
  const requestedNickname = ctx.spy(requestedUserParamAtom)
  const isBlocked = ctx.spy(requestedUserProfileBlockedAtom)
  if (!requestedNickname) return null;

  const isOwner = ctx.spy(requestedUserIsSameAtom)

  return (
    isOwner ? (
      <div className="flex items-center bg-shark-50/10 w-full backdrop-blur-lg h-10 rounded-md overflow-hidden">
        <ProfileBackgroundChangeModal />
        <ProfileProfileSettingsModal />
      </div>
    ) : (
      <div className="flex items-center gap-2 justify-end lg:w-fit">
        {!isBlocked && <FriendButton recipient={requestedNickname} />}
        <SyncTarget target={requestedNickname} />
        <BlockUserModal recipient={requestedNickname} />
        <MoreWrapper variant="medium">
          <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
            <UserBlockedTrigger />
            <Separator />
            <ReportCreateModal reportType="account" targetNickname={requestedNickname} />
          </div>
        </MoreWrapper>
      </div>
    )
  )
}, "UserCoverPanel")