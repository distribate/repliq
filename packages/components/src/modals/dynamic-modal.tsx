import { ReactNode, useEffect, useState } from 'react';
import { MutationKey, MutationStatus, useMutationState } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

type DynamicModalProps = {
  trigger: ReactNode,
  content: ReactNode,
  mutationKey: MutationKey,
  status?: MutationStatus,
  contentClassName?: string
}

export const DynamicModal = ({
  content, trigger, status = "success", mutationKey, contentClassName
}: DynamicModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const data = useMutationState({
    filters: { mutationKey },
    select: mutation => mutation.state.status
  })
  
  const mutationStatus = data[data.length - 1];
  
  useEffect(() => {
    if (mutationStatus === status) setOpen(false);
  }, [mutationStatus])
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger}
      </DialogTrigger>
      <DialogContent className={contentClassName}>
        {content}
      </DialogContent>
    </Dialog>
  )
}