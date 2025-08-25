import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@repo/shared/utils/cn";
import { ComponentPropsWithoutRef } from "react";

const Progress = ({ 
  className, value, ...props 
}: ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>) => (
  <ProgressPrimitive.Root
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-md bg-shark-950",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-shark-50 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };