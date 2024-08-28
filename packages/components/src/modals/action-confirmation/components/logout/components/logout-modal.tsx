import { ReactNode } from 'react';
import { LogoutConfirmation } from './logout-confirmation.tsx';
import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';

export const LOGOUT_MODAL_NAME = "logout-modal"

type LogoutModal = {
  trigger: ReactNode
}

export const LogoutModal = ({
  trigger
}: LogoutModal) => {
  return (
    <DialogWrapper
      name={LOGOUT_MODAL_NAME}
      trigger={trigger}
    >
      <LogoutConfirmation />
    </DialogWrapper>
  )
}