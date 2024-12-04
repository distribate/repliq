import { SectionPrivatedContent } from "#templates/section-privated-content.tsx";
import { ProfileSectionLayout } from "#layouts/profile-section-layout.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/src/components/tabs.tsx";
import { UserPageParam } from "@repo/types/global";
import { GeneralStats } from "#profile/components/stats/components/general-stats.tsx";
import { LandsStats } from "#profile/components/stats/components/lands-stats.tsx";

type UserProfileGameStatsProps = UserPageParam & {
  isSectionPrivatedByOwner: boolean;
};

export const UserProfileGameStats = async ({
  nickname,
  uuid,
  isSectionPrivatedByOwner,
}: UserProfileGameStatsProps) => {
  if (!uuid) return null;

  return (
    <ProfileSectionLayout
      header={isSectionPrivatedByOwner && <SectionPrivatedContent />}
    >
      <Tabs
        defaultValue="general"
        className="flex items-start w-full h-full gap-2"
      >
        <div className="flex flex-col gap-y-2 w-4/5 h-full">
          <TabsContent value="general">
            <GeneralStats nickname={nickname} uuid={uuid} />
          </TabsContent>
          <TabsContent value="lands">
            <LandsStats uuid={uuid} />
          </TabsContent>
        </div>
        <TabsList className="flex flex-col *:w-full gap-y-1 w-1/5">
          <TabsTrigger value="general">Основное</TabsTrigger>
          <TabsTrigger value="lands">Территории</TabsTrigger>
          <TabsTrigger value="forum">Форум</TabsTrigger>
        </TabsList>
      </Tabs>
    </ProfileSectionLayout>
  );
};
