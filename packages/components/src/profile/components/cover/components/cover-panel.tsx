import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import Photo from '@repo/assets/images/minecraft/photo.webp';
import { ProfileDescriptionChangeModal } from '#modals/user-settings/profile-description-change-modal.tsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@repo/ui/src/components/button.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { MoreWrapper } from '#wrappers/more-wrapper.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { FriendButton } from '#buttons/friends/friend-button.tsx';
import { ReportCreateModal } from '#modals/action-confirmation/components/report/components/report-create-modal.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { BlockUserModal } from '#modals/action-confirmation/components/block-user/components/block-user-modal.tsx';
import { blockedUserQuery } from '@repo/lib/queries/blocked-user-query.ts';

const ProfileBackgroundUpdateModal = dynamic(() =>
    import('@repo/components/src/modals/custom/profile-background-update-modal.tsx')
    .then(m => m.ProfileBackgroundUpdateModal), {
    loading: () => <Skeleton className="h-8" />,
  },
);

const DeleteCoverModal = dynamic(() =>
    import('@repo/components/src/modals/action-confirmation/components/delete-cover/components/delete-cover-modal.tsx')
    .then(m => m.DeleteCoverModal), {
    loading: () => <Skeleton className="h-8" />,
  },
);

const userCoverPanelVariants = cva('relative z-[3] flex bg-transparent gap-x-4 border-none', {
  variants: {
    variant: { default: '', end: 'self-end justify-end' },
  },
});

interface UserCoverPanelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userCoverPanelVariants> {
  requestedNickname: string;
}

export const UserCoverPanel = ({
  variant, className, requestedNickname, ...props
}: UserCoverPanelProps) => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const { data: blockedState, isLoading } = blockedUserQuery(requestedNickname);
  
  const isBlocked = blockedState?.recipient === requestedNickname || false;
  const youIsBlocked = blockedState?.initiator === requestedNickname || false;
  
  const isOwner = currentUser.nickname === requestedNickname;
  
  return (
    <div className={userCoverPanelVariants(({ variant, className }))} {...props}>
      <div className="flex items-center gap-2">
        {!isLoading && (
          (!isOwner && (!isBlocked && !youIsBlocked)) && (
            <FriendButton reqUserNickname={requestedNickname} />
          )
        )}
        {!isOwner && (
          <MoreWrapper
            variant="medium"
            properties={{ sideAlign: 'bottom', contentAlign: 'end' }}
          >
            <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
              {(!isLoading && (!youIsBlocked)) && (
                <BlockUserModal requestedNickname={requestedNickname}/>
              )}
              {!isLoading && (
                (!youIsBlocked) && (
                  <>
                    <Separator />
                    <ReportCreateModal reportType="account" targetNickname={requestedNickname} />
                  </>
                )
              )}
            </div>
          </MoreWrapper>
        )}
      </div>
      {isOwner && (
        <div className="flex items-center bg-shark-900/10 backdrop-blur-lg h-10 rounded-md overflow-hidden">
          <DropdownWrapper
            properties={{
              triggerAsChild: true, contentAlign: 'end', contentClassname: 'w-[200px]',
            }}
            trigger={
              <Button
                title="Настройка шапки профиля"
                type="button"
                className="rounded-r-none px-6 hover:bg-shark-800"
              >
                <Image
                  src={Photo?.src}
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