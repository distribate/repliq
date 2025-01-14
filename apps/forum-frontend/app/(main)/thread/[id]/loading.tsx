import { ThreadMainSkeleton } from "@repo/components/src/thread/components/thread-main/components/thread-main-skeleton";

export default function ThreadLoadingPage() {
  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <ThreadMainSkeleton />
    </div>
  )
}