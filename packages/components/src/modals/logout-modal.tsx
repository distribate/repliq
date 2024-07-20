import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import { LogoutConfirmation } from './action-confirmation/components/logout/components/logout-confirmation.tsx';
import { ReactNode } from 'react';

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