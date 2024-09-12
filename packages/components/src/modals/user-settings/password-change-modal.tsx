import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  UserSettingOption
} from '../../cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';
import GoldIngot from "@repo/assets/images/minecraft/gold_ingot.webp"

export const PASSWORD_CHANGE_MODAL_NAME = 'password-change';

export const PasswordChangeModal = () => {
  return (
    <DialogWrapper
      name={PASSWORD_CHANGE_MODAL_NAME}
      trigger={
        <UserSettingOption title="Пароль" imageSrc={GoldIngot.src}>
          ...
        </UserSettingOption>
      }
    >
      ...
    </DialogWrapper>
  );
};