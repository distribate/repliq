import { UserPageParam } from '@repo/types/config/page-types.ts';
import { Suspense } from 'react';
import { GeneralStats } from '../components/general/components/general-stats.tsx';
import { LandsStats } from '../components/lands/components/lands-stats.tsx';
import { GeneralStatsSkeleton } from '../components/general/components/general-stats-skeleton.tsx';
import { LandsStatsSkeleton } from '../components/lands/components/lands-stats-skeleton.tsx';
import { SectionPrivatedContent } from '../../../../templates/section-privated-content.tsx';
import { ProfileSectionLayout } from '../../../../layouts/profile-section-layout.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/src/components/tabs.tsx';

type UserProfileGameStatsProps = UserPageParam & {
  isSectionPrivatedByOwner: boolean
}

export const UserProfileGameStats = async({
  nickname, uuid, isSectionPrivatedByOwner,
}: UserProfileGameStatsProps) => {
  if (!nickname || !uuid) return null;
  
  return (
    <ProfileSectionLayout
      header={
        isSectionPrivatedByOwner && <SectionPrivatedContent />
      }
    >
      <Tabs defaultValue="general" className="flex items-start w-full h-full gap-2">
        <div className="flex flex-col gap-y-2 w-4/5 h-full">
          <Suspense fallback={<GeneralStatsSkeleton />}>
            <TabsContent value="general">
              <GeneralStats nickname={nickname} uuid={uuid} />
            </TabsContent>
          </Suspense>
          <Suspense fallback={<LandsStatsSkeleton />}>
            <TabsContent value="lands">
              <LandsStats nickname={nickname} uuid={uuid} />
            </TabsContent>
          </Suspense>
        </div>
        <TabsList className="flex flex-col *:w-full gap-y-1 w-1/5">
          <TabsTrigger value="general">
            Основное
          </TabsTrigger>
          <TabsTrigger value="lands">
            Территории
          </TabsTrigger>
          <TabsTrigger value="forum">
            Форум
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </ProfileSectionLayout>
  );
};