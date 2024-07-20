'use client';

import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog';
import { forwardRef, ReactNode, useCallback, useMemo } from 'react';
import { DialogContentProps, DialogProps } from '@radix-ui/react-dialog';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { DIALOG_STATE_QUERY_KEY, dialogParamsQuery } from '@repo/lib/queries/dialog-params-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { QueryCache } from '@tanstack/react-query'

interface DialogContentExtended extends DialogContentProps {}

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

export const DialogWrapper = forwardRef<
  HTMLDivElement, DialogWrapperProps
>((
  {
    trigger,
    children,
    asChild,
    name,
    properties = { dialogTriggerClassName: '', dialogContentClassName: '', withClose: true },
    dialog,
    ...dialogProps
  },
  ref,
) => {
  const { setDialogIdMutation, removeDialogMutation } = useDialog();
  const qc = useQueryClient()
  // const dialogParams = qc.getQueryData<string[]>(DIALOG_STATE_QUERY_KEY)
  const { data: dialogParams } = dialogParamsQuery()
  
  const isDialogOpen = () => {
    if (!dialogParams) return false;
    
    return dialogParams.some(dialog => dialog === name);
  }
  
  const handleDialogState = (open: boolean) => {
    if (open) {
      setDialogIdMutation.mutate(name);
    } else {
      removeDialogMutation.mutate(name);
    }
  }
  
  return (
    <Dialog
      open={isDialogOpen()}
      onOpenChange={handleDialogState}
      {...dialogProps}
    >
      <DialogTrigger
        asChild={asChild}
        className={properties?.dialogTriggerClassName}
      >
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