import { PageWrapper } from '@repo/components/src/wrappers/page-wrapper.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

export default function CreateThreadLoadingPage() {
  return (
    <PageWrapper className="p-6">
      <div className="flex flex-col w-full gap-4">
        <Skeleton className="w-full h-64" />
      </div>
      <div className="flex flex-row items-start gap-4 w-full">
        <Skeleton className="flex flex-col gap-y-4 w-3/4 max-w-3/4 overflow-hidden"/>
        <Skeleton className="flex flex-grow-0 sticky w-1/4 max-w-1/4 top-0 h-fit"/>
      </div>
    </PageWrapper>
  );
}