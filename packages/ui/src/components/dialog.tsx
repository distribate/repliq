import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@repo/lib/utils/ui/cn.ts";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
} from "react";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-xl data-[state=open]:animate-in" +
      " data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = ({
  className, children, withClose = true, ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  withClose?: boolean;
}) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      onOpenAutoFocus={e => e.preventDefault()}
      className={cn(
        `fixed left-[50%] pt-4 ease-in-out transition-all duration-150 top-[50%] 
         max-w-[calc(100%-16px)] w-full lg:min-w-[512px] lg:w-fit max-h-[calc(100%-200px)] 
         overflow-y-auto z-50 grid rounded-md translate-x-[-50%] translate-y-[-50%] 
         gap-4 dark:bg-shark-950 bg-shark-950 px-1 pb-1 shadow-lg duration-200 data-[state=open]:animate-in 
         data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
         data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95`,
        className,
      )}
      {...props}
    >
      {children}
      {withClose && (
        <DialogPrimitive.Close
          className="absolute right-4 z-[2] hover:bg-red-600 p-2 top-4 rounded-lg opacity-70
				   transition-opacity hover:opacity-100 focus:outline-none
				   disabled:pointer-events-none data-[state=open]:bg-shark-900 data-[state=open]:text-shark-50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
)
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className, ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className, ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
)
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = ({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-shark-50", className)}
    {...props}
  />
)
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
