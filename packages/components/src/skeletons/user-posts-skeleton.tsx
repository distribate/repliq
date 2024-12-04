import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

export const UserPostsSkeleton = () => {
  return (
    <div className="flex flex-col w-full py-6 gap-6">
      <Separator orientation="horizontal" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
};
