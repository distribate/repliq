'use client';

import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog';
import { forwardRef, ReactNode } from 'react';
import { DialogContentProps, DialogProps } from '@radix-ui/react-dialog';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { dialogParamsQuery } from '@repo/lib/queries/dialog-params-query.ts';

interface DialogContentExtended
  extends DialogContentProps {
}

interface DialogWrapperProps extends DialogProps {
  trigger: ReactNode;
  children: ReactNode;
  asChild?: boolean;
  triggerClassName?: string;
  properties?: Partial<{
    dialogContentClassName: string;
    dialogTriggerClassName: string;
    withClose: boolean
  }>;
  name: string;
  dialog?: DialogContentExtended;
}

export const DialogWrapper = forwardRef<HTMLDivElement, DialogWrapperProps>(({
    trigger, children,
    asChild, name, properties = { dialogTriggerClassName: '', dialogContentClassName: '', withClose: true },
    dialog, ...dialogProps
  }, ref,
) => {
  const { setDialogIdMutation, removeDialogMutation } = useDialog();
  const { data: dialogParams } = dialogParamsQuery();
  
  const isDialogOpen = (): boolean => dialogParams.includes(name);
  
  const handleDialogState = (open: boolean) => {
    if (open) setDialogIdMutation.mutate(name);
    if (!open) removeDialogMutation.mutate(name);
  };
  
  return (
    <Dialog
      defaultOpen={isDialogOpen()}
      open={isDialogOpen()}
      onOpenChange={handleDialogState}
      {...dialogProps}
    >
      <DialogTrigger asChild={asChild} className={properties?.dialogTriggerClassName}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        ref={ref}
        withClose={properties?.withClose}
        className={properties?.dialogContentClassName}
        {...dialog}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
});