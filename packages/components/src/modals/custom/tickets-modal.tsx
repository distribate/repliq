import { ReactNode } from 'react';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { TicketsMenu } from '../../cards/components/user-personal-card/components/tickets/tickets-menu.tsx';

export const TICKETS_MODAL_NAME = "tickets"

type TicketsModal = {
  trigger: ReactNode
}

export const TicketsModal = ({
  trigger
}: TicketsModal) => {
  console.log('tickets-settings render')
  return (
    <DialogWrapper
      name={TICKETS_MODAL_NAME}
      trigger={trigger}
    >
      <TicketsMenu/>
    </DialogWrapper>
  )
}