import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { USER } from '@repo/types/entities/entities-type.ts';
import {
  RealNameChange
} from '../../cards/components/user-personal-card/components/profile-settings/components/real-name-change/components/real-name-change.tsx';

export const REAL_NAME_CHANGE_MODAL_NAME = "real-name-change"

type RealNameChangeModal = Pick<USER, "real_name">

export const RealNameChangeModal = ({
  real_name
}: RealNameChangeModal) => {
  return (
    <DialogWrapper
      name={REAL_NAME_CHANGE_MODAL_NAME}
      trigger={
        <div className="flex items-center gap-1">
          <Typography className="text-base">
            {real_name ? real_name : 'не указано'}
          </Typography>
        </div>
      }
    >
      <RealNameChange />
    </DialogWrapper>
  )
}