import { MailQuestion } from 'lucide-react';
import { TicketsModal } from '../../../../modals/tickets-modal.tsx';

export const OpenTicket = () => {
  return (
    <div className="flex justify-center overflow-hidden w-fit items-center">
      <TicketsModal
        trigger={
          <MailQuestion size={18} className="hover:text-pink-500 text-shark-300" />
        }
      />
    </div>
  );
};