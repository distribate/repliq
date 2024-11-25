import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export default function CreateThreadLoadingPage() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen gap-4">
      <Skeleton className="w-full h-48" />
      <div className="flex items-start gap-4 h-full w-full">
        <Skeleton className="w-3/4 max-w-3/4 h-full overflow-hidden" />
        <Skeleton className="flex flex-grow-0 sticky w-1/4 max-w-1/4 top-0 h-full" />
      </div>
    </div>
  );
}