'use client';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@repo/lib/utils/ui/cn.ts';
import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes } from 'react';

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

type HoverCardItemProps = Partial<{
  isActive: boolean
}>

const HoverCardItem = forwardRef<
  HTMLDivElement, HTMLAttributes<HTMLDivElement> & HoverCardItemProps
>(({ className, isActive, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        `${isActive && 'text-caribbean-green-500'}
			flex hover:bg-white/10 border border-none cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm relative`,
        className,
      )}
      {...props}
    />
  );
});

const HoverCardContent = forwardRef<
  ElementRef<typeof HoverCardPrimitive.Content>, ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded-lg' +
      ' border-[1px] border-white/10 dark:bg-shark-900 bg-shark-900 p-1 shadow-md outline-none' +
      ' data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0' +
      ' data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95' +
      ' data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2' +
      ' data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardItem };