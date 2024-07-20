import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { UserPersonalCard } from '../cards/components/user-personal-card/user-personal-card.tsx';
import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';

export const USER_SETTINGS_MODAL_NAME = 'settings-card'

export const UserSettingsModal = () => {
  return (
    <DialogWrapper
      name={USER_SETTINGS_MODAL_NAME}
      trigger={
        <HoverCardItem>
          Настройки
        </HoverCardItem>
      }
    >
      <UserPersonalCard/>
    </DialogWrapper>
  )
}