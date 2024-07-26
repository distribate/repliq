import { UserPageParam } from '@repo/types/config/page-types.ts';
import { Suspense } from 'react';
import { GeneralStats } from '../components/general/components/general-stats.tsx';
import { ClanStats } from '../components/clan/components/clan-stats.tsx';
import { LandsStats } from '../components/lands/components/lands-stats.tsx';
import { GeneralStatsSkeleton } from '../components/general/components/general-stats-skeleton.tsx';
import { LandsStatsSkeleton } from '../components/lands/components/lands-stats-skeleton.tsx';
import { ClanStatsSkeleton } from '../components/clan/components/clan-stats-skeleton.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';

export const UserGameStats = async({
  nickname, uuid,
}: UserPageParam) => {
  if (!nickname || !uuid) return null;
  
  return (
    <div className="flex flex-col w-full gap-y-6">
      <div className="flex items-center gap-2 py-2 px-4">
        <Typography className="font-semibold" textSize="large" textColor="shark_white">
          Игровая статистика
        </Typography>
      </div>
      <Separator/>
      <div className="flex flex-col w-full gap-y-4">
        <Suspense fallback={<GeneralStatsSkeleton />}>
          <GeneralStats nickname={nickname} uuid={uuid} />
        </Suspense>
        <Suspense fallback={<ClanStatsSkeleton />}>
          <ClanStats nickname={nickname} uuid={uuid} />
        </Suspense>
        <Suspense fallback={<LandsStatsSkeleton />}>
          <LandsStats nickname={nickname} uuid={uuid} />
        </Suspense>
      </div>
    </div>
  );
};