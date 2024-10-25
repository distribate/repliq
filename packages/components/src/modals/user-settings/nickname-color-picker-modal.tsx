import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  NicknameColorPicker
} from '../../cards/components/user-personal-card/components/profile-settings/components/nickname-color-picker.tsx';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';

export const NICKNAME_COLOR_PICKER_MODAL_NAME = "nickname-color-picker"

export const NicknameColorPickerModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  if (!currentUser) return;
  
  const nameColor = currentUser?.name_color;
  const nickname = currentUser?.nickname;
  
  return (
    <DialogWrapper
      name={NICKNAME_COLOR_PICKER_MODAL_NAME}
      properties={{ dialogContentClassName: 'min-w-[650px]' }}
      trigger={
        <div className="flex items-center gap-1">
          <div className="w-4 h-4" style={{ backgroundColor: nameColor }} />
          <Typography className="text-base">
            {nameColor.toString()}
          </Typography>
        </div>
      }
    >
      <NicknameColorPicker nickname={nickname} name_color={nameColor} />
    </DialogWrapper>
  )
}