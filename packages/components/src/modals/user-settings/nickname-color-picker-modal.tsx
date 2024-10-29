import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  NicknameColorPicker
} from '../../cards/components/user-personal-card/components/profile-settings/components/nickname-color-picker.tsx';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { DynamicModal } from '../dynamic-modal.tsx';
import { UPDATE_FIELD_MUTATION_KEY } from '@repo/lib/hooks/use-update-current-user.ts';

export const NicknameColorPickerModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  if (!currentUser) return;
  
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