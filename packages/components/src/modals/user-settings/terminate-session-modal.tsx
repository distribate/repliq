import { X } from 'lucide-react';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  UserSessionBlockProps,
  useSelectSessionId,
} from '../../cards/components/user-personal-card/components/account-settings/components/user-session-block.tsx';
import {
  TerminateSessionConfirmation
} from '../action-confirmation/components/terminate-session/components/terminate-session-confirmation.tsx';

export const TERMINATE_SESSION_MODAL_NAME = "terminate-session"

type TerminateSessionModal = Pick<UserSessionBlockProps, "id">

export const TerminateSessionModal = ({
  id
}: TerminateSessionModal) => {
  const { setValueMutation } = useSelectSessionId()
  
  if (!id) return;
  
  return (
    <DialogWrapper
      name={TERMINATE_SESSION_MODAL_NAME}
      trigger={
        <div onClick={() => setValueMutation.mutate(id)} className="cursor-pointer">
          <X className="h-4 w-4 text-shark-200 hover:text-shark-50"/>
        </div>
      }
    >
      <TerminateSessionConfirmation/>
    </DialogWrapper>
  )
}