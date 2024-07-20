import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  NicknameColorPicker
} from '../../cards/components/user-personal-card/components/profile-settings/components/nickname-color-picker.tsx';
import { USER } from '@repo/types/entities/entities-type.ts';

export const NICKNAME_COLOR_PICKER_MODAL_NAME = "nickname-color-picker"

type NicknameColorPickerModal = Pick<USER, "name_color" | "nickname">

export const NicknameColorPickerModal = ({
  name_color, nickname
}: NicknameColorPickerModal) => {
  return (
    <DialogWrapper
      name={NICKNAME_COLOR_PICKER_MODAL_NAME}
      properties={{ dialogContentClassName: 'min-w-[650px]' }}
      trigger={
        <div className="flex items-center gap-1">
          <div className="w-4 h-4" style={{ backgroundColor: name_color }} />
          <Typography className="text-base">
            {name_color.toString()}
          </Typography>
        </div>
      }
    >
      <NicknameColorPicker nickname={nickname} name_color={name_color} />
    </DialogWrapper>
  )
}