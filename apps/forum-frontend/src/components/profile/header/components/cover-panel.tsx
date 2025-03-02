import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { DropdownWrapper } from "#components/wrappers/dropdown-wrapper.tsx";
import Photo from "@repo/assets/images/minecraft/photo.webp";
import { ProfileDescriptionChangeModal } from "#components/modals/user-settings/profile-description-change-modal.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { MoreWrapper } from "#components/wrappers/more-wrapper.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { FriendButton } from "#components/buttons/friend-button.tsx";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { BlockUserModal } from "#components/modals/action-confirmation/components/block-user/components/block-user-modal.tsx";
import { ProfileBackgroundUpdateModal } from "#components/modals/custom/profile-background-update-modal.tsx";
import { DeleteCoverModal } from "#components/modals/action-confirmation/components/delete-cover/delete-cover-modal.tsx";

const userCoverPanelVariants = cva(
  "relative z-[3] flex bg-transparent gap-x-4 border-none",
  {
    variants: {
      variant: {
        default: "",
        end: "lg:self-end self-center justify-center lg:justify-end"
      },
    },
  },
);

interface UserCoverPanelProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof userCoverPanelVariants> {
  requestedNickname: string;
}

export const UserCoverPanel = ({
  variant,
  className,
  requestedNickname,
  ...props
}: UserCoverPanelProps) => {
  const { nickname: currentUserNickname } = getUser();

  const isOwner = currentUserNickname === requestedNickname;

  return (
    <div className={userCoverPanelVariants({ variant, className })} {...props}>
      {!isOwner && (
        <div className="flex items-center gap-2">
          <FriendButton recipient={requestedNickname} />
          <MoreWrapper
            variant="medium"
            properties={{ sideAlign: "bottom", contentAlign: "end" }}
          >
            <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
              <BlockUserModal recipient={requestedNickname} />
              <>
                <Separator />
                <ReportCreateModal reportType="account" targetNickname={requestedNickname} />
              </>
            </div>
          </MoreWrapper>
        </div>
      )}
      {isOwner && (
        <div className="flex items-center bg-shark-900/10 backdrop-blur-lg h-10 rounded-md overflow-hidden">
          <DropdownWrapper
            properties={{
              triggerAsChild: true,
              contentAlign: "end",
              contentClassname: "w-[200px]",
            }}
            trigger={
              <Button
                title="Настройка шапки профиля"
                type="button"
                className="rounded-r-none px-6 hover:bg-shark-800"
              >
                <img
                  src={Photo}
                  width={48}
                  className="w-[24px] h-[24px]"
                  height={48}
                  loading="lazy"
                  alt=""
                />
              </Button>
            }
            content={
              <div className="flex flex-col gap-y-1">
                <ProfileBackgroundUpdateModal />
                <DeleteCoverModal />
              </div>
            }
          />
          <ProfileDescriptionChangeModal />
        </div>
      )}
    </div>
  );
};
