import { UserPageParam } from '@repo/types/config/page-types.ts';
import { Suspense } from 'react';
import { GeneralStats } from '../components/general/components/general-stats.tsx';
import { LandsStats } from '../components/lands/components/lands-stats.tsx';
import { GeneralStatsSkeleton } from '../components/general/components/general-stats-skeleton.tsx';
import { LandsStatsSkeleton } from '../components/lands/components/lands-stats-skeleton.tsx';

export const UserProfileGameStats = async({
  nickname, uuid,
}: UserPageParam) => {
  if (!nickname || !uuid) return null;
  
  return (
    <div className="flex flex-col w-full gap-y-4">
      <Suspense fallback={<GeneralStatsSkeleton />}>
        <GeneralStats nickname={nickname} uuid={uuid} />
      </Suspense>
      <Suspense fallback={<LandsStatsSkeleton />}>
        <LandsStats nickname={nickname} uuid={uuid} />
      </Suspense>
    </div>
  );
};