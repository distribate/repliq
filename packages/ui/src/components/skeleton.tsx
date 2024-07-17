import { cn } from '@repo/lib/utils/ui/cn.ts';
import { HTMLAttributes } from 'react';

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(`isolate bg-white/10 rounded-md overflow-hidden shadow-xl shadow-black/5 before:border-t
        before:border-caribbean-green-500/10 relative
        before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent
        before:via-caribbean-green-500/10 before:to-transparent`, className)}
      {...props}
    >
      <div
        className={`bg-gradient-to-r from-transparent via-caribbean-green-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]`}
      />
    </div>
  );
}