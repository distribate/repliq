import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import Photo from '@repo/assets/images/minecraft/photo.webp';
import { FriendButton } from '../../components/add-friend/components/friend-button.tsx';
import { ControlPanel } from '../../components/control/components/control-panel.tsx';
import {
  ProfileDescriptionChangeModal,
} from '#modals/user-settings/profile-description-change-modal.tsx';
import dynamic from 'next/dynamic';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Button } from '@repo/ui/src/components/button.tsx';

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
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  if (!currentUser) return null;
  
  const isOwner = currentUser?.nickname === reqUserNickname;
  
  return (
    <div className={userCoverPanelVariants(({ variant, className }))} {...props}>
      {!isOwner && (
        <div className="flex items-center gap-2">
          <FriendButton reqUserNickname={reqUserNickname} />
          <ControlPanel />
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