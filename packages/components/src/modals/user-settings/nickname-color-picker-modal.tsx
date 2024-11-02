import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  NicknameColorPicker
} from '#cards/components/user-personal-card/components/profile-settings/components/nickname-color-picker.tsx';
import { DynamicModal } from '../dynamic-modal.tsx';
import { UPDATE_FIELD_MUTATION_KEY } from '@repo/lib/hooks/use-update-current-user.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const NicknameColorPickerModal = () => {
  const currentUser = getUser();
  
  if (!currentUser) return null;
  
  const nameColor = currentUser?.name_color;
  const nickname = currentUser?.nickname;
  
  return (
    <DynamicModal
      contentClassName="min-w-[650px]"
      trigger={
        <div className="flex items-center gap-1">
          <div className="w-4 h-4" style={{ backgroundColor: nameColor }} />
          <Typography className="text-base">
            {nameColor.toString()}
          </Typography>
        </div>
      }
      content={
        <NicknameColorPicker nickname={nickname} name_color={nameColor} />
      }
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
    />
  )
}