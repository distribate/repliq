import { ReactNode } from 'react';
import { TicketsMenu } from '../../cards/components/user-personal-card/components/tickets/tickets-menu.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

type TicketsModal = {
  trigger: ReactNode
}

export const TicketsModal = ({
  trigger
}: TicketsModal) => {
  return (
    <Dialog>
      <DialogTrigger>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <TicketsMenu/>
      </DialogContent>
    </Dialog>
  )
}