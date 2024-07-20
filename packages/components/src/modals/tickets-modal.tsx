import { TicketsMenu } from '../cards/components/user-personal-card/components/tickets/tickets-menu.tsx';
import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import { ReactNode } from 'react';

export const TICKETS_MODAL_NAME = "tickets"

type TicketsModal = {
  trigger: ReactNode
}

export const TicketsModal = ({
  trigger
}: TicketsModal) => {
  return (
    <DialogWrapper
      name={TICKETS_MODAL_NAME}
      trigger={trigger}
    >
      <TicketsMenu/>
    </DialogWrapper>
  )
}