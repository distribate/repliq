import Photo from "@repo/assets/images/minecraft/photo.webp";
import { ProfileDescriptionChangeModal } from "#components/modals/user-settings/components/profile-description-change-modal";
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
import { coverAtom } from "../models/cover.model";

export const UserCoverPanel = reatomComponent(({ ctx }) => {
  const requestedNickname = ctx.spy(requestedUserParamAtom)
  if (!requestedNickname) return null;

  const isOwner = ctx.spy(requestedUserIsSameAtom)

  return (
    <div
      data-state={ctx.spy(coverAtom).inView ? "end" : "default"}
      className={`
        relative z-[3] flex w-full lg:w-fit items-center bg-transparent gap-4
        data-[state=end]:lg:self-end data-[state=end]:justify-center data-[state=end]:lg:justify-end 
      `}
    >
      {!isOwner ? (
        <div className="flex items-center gap-2 justify-end lg:w-fit">
          <FriendButton recipient={requestedNickname} />
          <MoreWrapper
            variant="medium"
            properties={{ sideAlign: "bottom", contentAlign: "end" }}
          >
            <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
              <BlockUserModal recipient={requestedNickname} />
              <Separator />
              <ReportCreateModal reportType="account" targetNickname={requestedNickname} />
            </div>
          </MoreWrapper>
        </div>
      ) : (
        <div className="flex items-center bg-shark-50/10 w-full backdrop-blur-lg h-10 rounded-md overflow-hidden">
          <Dialog>
            <DialogTrigger className="w-1/2 h-full">
              <div className="flex items-center justify-center w-full h-full rounded-r-none px-6 hover:bg-shark-800">
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
          <ProfileDescriptionChangeModal />
        </div>
      )}
    </div>
  );
}, "UserCoverPanel")