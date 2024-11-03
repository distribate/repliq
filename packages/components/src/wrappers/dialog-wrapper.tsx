import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { forwardRef, ReactNode } from 'react';
import { DialogContent as DialogPrimitive } from '@radix-ui/react-dialog';

type DialogWrapperProps = {
  trigger: ReactNode,
  content: ReactNode
}

export const DialogWrapper = ({
  trigger, content
}: DialogWrapperProps) => {
  return (
    <Dialog>
      <DialogTrigger>
      
      </DialogTrigger>
      <DialogContent>
      
      </DialogContent>
    </Dialog>
  )
}