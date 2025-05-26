import Photo from "@repo/assets/images/minecraft/photo.webp";
import { MoreWrapper } from "#components/wrappers/components/more-wrapper";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { BlockUserModal } from "#components/modals/action-confirmation/components/block-user/components/block-user-modal.tsx";
import { ProfileBackgroundUpdateModal } from "#components/modals/custom/components/profile-background-update-modal";
import { DeleteCoverModal } from "#components/modals/action-confirmation/components/delete-cover/delete-cover/delete-cover-modal";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { Typography } from "@repo/ui/src/components/typography";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserIsSameAtom, requestedUserParamAtom } from "#components/profile/requested-user.model";
import { UserProfileSettings } from "#components/cards/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";

const ProfileProfileSettingsModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-1/2">
        <Button title="Настройка профиля" type="button" className="rounded-l-none px-4 hover:bg-shark-800/40">
          <img src={BookAndQuill} width={24} className="w-[24px] h-[24px]" height={24} alt="" />
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
        <div className="flex items-center justify-center w-full h-full rounded-r-none px-4 hover:bg-shark-800/40">
          <img src={Photo} width={24} height={24} alt="" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
          <Typography variant="dialogTitle">
            Фон профиля
          </Typography>
          <div className="flex flex-col gap-2 p-2 w-full gap-y-1">
            <ProfileBackgroundUpdateModal />
            <DeleteCoverModal />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const UserCoverPanel = reatomComponent(({ ctx }) => {
  const requestedNickname = ctx.spy(requestedUserParamAtom)
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
        <FriendButton recipient={requestedNickname} />
        <MoreWrapper variant="medium">
          <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
            <BlockUserModal recipient={requestedNickname} />
            <Separator />
            <ReportCreateModal reportType="account" targetNickname={requestedNickname} />
          </div>
        </MoreWrapper>
      </div>
    )
  )
}, "UserCoverPanel")