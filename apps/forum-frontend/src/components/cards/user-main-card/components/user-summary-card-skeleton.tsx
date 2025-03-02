import { SteveLoader } from "@repo/ui/src/components/steve-loader";

export const UserSummaryCardSkeleton = () => {
  return (
    <div className="flex flex-col h-[512px] gap-y-4 relative w-full rounded-lg p-4 bg-shark-950 border-[1px] border-white/10 items-center">
      <SteveLoader />
    </div>
  );
};