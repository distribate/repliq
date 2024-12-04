import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";

export const SidebarDesktopSkeleton = () => {
  return (
    <div
      className={`flex flex-col justify-between
		  px-3 rounded-lg overflow-hidden min-h-screen h-full py-6
			bg-primary-color outline-none w-[300px]`}
    >
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <div className="flex flex-row items-center gap-4">
          <Skeleton className="w-[42px] h-[42px]" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Separator />
        <div className="flex items-center gap-2 justify-between w-full">
          <Skeleton className="flex h-10 items-center gap-1 grow" />
          <Skeleton className="flex h-10 w-10" />
        </div>
        <Separator />
        <Skeleton className="flex gap-x-3 h-[50px] items-center w-full" />
        <Separator />
        <Skeleton className="flex h-10 items-center w-full" />
        <Separator />
        <Skeleton className="flex h-[230px] items-center w-full" />
        <Separator />
        <div className="flex flex-col gap-y-2 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="flex h-10 items-center w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};
