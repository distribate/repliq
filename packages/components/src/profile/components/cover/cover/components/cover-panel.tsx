import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { DropdownWrapper } from '../../../../../wrappers/dropdown-wrapper.tsx';
import { ImageWrapper } from '../../../../../wrappers/image-wrapper.tsx';
import Photo from '@repo/assets/images/minecraft/photo.webp';
import { FriendButton } from '../../components/add-friend/components/friend-button.tsx';
import { ControlPanel } from '../../components/control/components/control-panel.tsx';
import {
  ProfileDescriptionChangeModal,
} from '../../../../../modals/user-settings/profile-description-change-modal.tsx';
import { ProfileBackgroundUpdateModal } from '../../../../../modals/custom/profile-background-update-modal.tsx';
import {
  DeleteCoverModal
} from '../../../../../modals/action-confirmation/components/delete-cover/components/delete-cover-modal.tsx';

const userCoverPanelVariants = cva('relative z-[3] flex bg-transparent gap-x-4 border-none', {
  variants: {
    variant: { default: '', end: 'self-end justify-end' },
  },
});

interface UserCover {
  reqUserNickname: string,
  isOwner: boolean
}

interface UserCoverPanelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userCoverPanelVariants>, UserCover {
}

export const UserCoverPanel = ({
  variant, className, reqUserNickname, isOwner, ...props
}: UserCoverPanelProps) => {
  return (
    <div
      className={userCoverPanelVariants(({ variant, className }))}
      {...props}
    >
      {!isOwner && (
        <div className="flex items-center gap-2">
          <FriendButton reqUserNickname={reqUserNickname} />
          <ControlPanel />
        </div>
      )}
      {isOwner && (
        <div className="flex items-center gap-x-2 bg-shark-900 h-10 rounded-lg border border-white/10 px-2">
          <DropdownWrapper
            properties={{ triggerAsChild: true, contentAlign: 'end', contentClassname: 'w-[196px]' }}
            trigger={
              <div className="rounded-md p-1 cursor-pointer">
                <ImageWrapper
                  propSrc={Photo?.src}
                  width={26}
                  height={26}
                  loading="eager"
                  propAlt="Change cover image"
                />
              </div>
            }
            content={
              <div className="flex flex-col gap-y-1">
                <ProfileBackgroundUpdateModal />
                <DeleteCoverModal/>
              </div>
            }
          />
          <ProfileDescriptionChangeModal />
        </div>
      )}
    </div>
  );
};