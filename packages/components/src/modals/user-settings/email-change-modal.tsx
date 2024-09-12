import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  UserSettingOption
} from '../../cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';
import BannerPattern from "@repo/assets/images/minecraft/banner_pattern.webp"

export const EMAIL_CHANGE_MODAL_NAME = 'email-change';

export const EmailChangeModal = () => {
  return (
    <DialogWrapper
      name={EMAIL_CHANGE_MODAL_NAME}
      trigger={
        <UserSettingOption title="Почта" imageSrc={BannerPattern.src}>
          ...
        </UserSettingOption>
      }
    >
      ...
    </DialogWrapper>
  );
};