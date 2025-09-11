import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@repo/shared/utils/cn";

const Progress = ({
  className, value, ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) => (
  <ProgressPrimitive.Root
    data-slot="progress"
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-md bg-shark-950",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className="h-full w-full flex-1 bg-shark-50 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };