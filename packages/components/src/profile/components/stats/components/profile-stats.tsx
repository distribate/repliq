import { SectionPrivatedContent } from "#templates/section-privated-content.tsx";
import { ProfileSectionLayout } from "#layouts/profile-section-layout.tsx";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@repo/ui/src/components/tabs.tsx";
// import { GeneralStats } from "#profile/components/stats/components/general-stats.tsx";
// import { LandsStats } from "#profile/components/stats/components/lands-stats.tsx";
// @ts-ignore
import Duo from "@repo/assets/gifs/duo.gif";
import { Typography } from "@repo/ui/src/components/typography";

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
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
          <div className="flex flex-col items-center gap-y-4">
            <img src={Duo} alt="" width={196} height={196} />
            <Typography className="text-xl font-bold text-shark-50">
              В разработке
            </Typography>
          </div>
        </div>
      </div>
      {/* <Tabs
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
      </Tabs> */}
    </ProfileSectionLayout>
  );
};
