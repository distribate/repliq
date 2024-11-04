import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes, Suspense } from 'react';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import Photo from '@repo/assets/images/minecraft/photo.webp';
import { ProfileDescriptionChangeModal } from '#modals/user-settings/profile-description-change-modal.tsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@repo/ui/src/components/button.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { MoreWrapper } from '#wrappers/more-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Ban } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { FriendButton } from '#buttons/friends/friend-button.tsx';
import { ReportCreateModal } from '#modals/action-confirmation/components/report/components/report-create-modal.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

const ProfileBackgroundUpdateModal = dynamic(() =>
  import('@repo/components/src/modals/custom/profile-background-update-modal.tsx')
  .then(m => m.ProfileBackgroundUpdateModal),
);

const DeleteCoverModal = dynamic(() =>
  import('@repo/components/src/modals/action-confirmation/components/delete-cover/components/delete-cover-modal.tsx')
  .then(m => m.DeleteCoverModal),
);

const userCoverPanelVariants = cva('relative z-[3] flex bg-transparent gap-x-4 border-none', {
  variants: {
    variant: {
      default: '',
      end: 'self-end justify-end',
    },
  },
});

interface UserCover {
  reqUserNickname: string;
}

interface UserCoverPanelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userCoverPanelVariants>, UserCover {
}

export const UserCoverPanel = ({
  variant, className, reqUserNickname, ...props
}: UserCoverPanelProps) => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const isOwner = currentUser.nickname === reqUserNickname;
  
  return (
    <div className={userCoverPanelVariants(({ variant, className }))} {...props}>
      {!isOwner && (
        <div className="flex items-center gap-2">
          <FriendButton reqUserNickname={reqUserNickname} />
          <MoreWrapper
            variant="selected"
            properties={{ sideAlign: 'left', contentAlign: 'end' }}
          >
            <div className="flex flex-col gap-y-1 *:w-full w-full items-start">
              <HoverCardItem className="group gap-2">
                <Ban size={16} className="text-shark-300" />
                <Typography>Добавить в черный список</Typography>
              </HoverCardItem>
              <Separator />
              <ReportCreateModal
                reportType="account"
                targetNickname={reqUserNickname}
              />
            </div>
          </MoreWrapper>
        </div>
      )}
      {isOwner && (
        <div className="flex items-center bg-shark-900/10 backdrop-blur-lg h-10 rounded-lg">
          <DropdownWrapper
            properties={{
              triggerAsChild: true, contentAlign: 'end', contentClassname: 'w-[200px]',
            }}
            trigger={
              <Button title="Настройка шапки профиля" type="button" className="px-6 hover:bg-shark-800">
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
                <Suspense fallback={<Skeleton className="h-16" />}>
                  <ProfileBackgroundUpdateModal />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-16" />}>
                  <DeleteCoverModal />
                </Suspense>
              </div>
            }
          />
          <ProfileDescriptionChangeModal />
        </div>
      )}
    </div>
  );
};