import { SectionPrivatedContent } from "#components/templates/section-privated-content.tsx";
import { ProfileSectionLayout } from '#components/layout/profile-section-layout.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs";
import { GeneralStats } from "./general-stats";
import { LandsStats } from "./lands-stats";

type UserProfileGameStatsProps = {
  nickname: string,
  uuid: string,
  isSectionPrivatedByOwner: boolean;
};

export const UserProfileGameStats = ({
  nickname, uuid, isSectionPrivatedByOwner
}: UserProfileGameStatsProps) => {
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
            <GeneralStats nickname={nickname} />
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
