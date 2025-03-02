import { Typography } from "@repo/ui/src/components/typography.tsx";
import { landsStatsQuery } from "../queries/lands-stats-query.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/src/components/accordion.tsx";
import { LandsStatsNotFound } from "./lands-stats-not-found.tsx";
import { ProfileStatsLayout } from "#components/profile/stats/components/profile-stats-layout.tsx";
import { StatsRequest } from "#components/profile/stats/types/stats-types.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { SomethingError } from "#components/templates/something-error.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";

const LandsStatsSkeleton = () => (
  <Skeleton className="flex flex-col h-[400px] gap-y-2 rounded-md px-4 py-2" />
);

export const LandsStats = ({ uuid }: Pick<StatsRequest, "uuid">) => {
  const { data: lands, isLoading, isError } = landsStatsQuery(uuid);

  if (isLoading) return <LandsStatsSkeleton />;
  if (isError) return <SomethingError />;

  if (!lands || !lands.length) return <LandsStatsNotFound />;

  return (
    <Accordion type="multiple" className="font-[Minecraft] w-full">
      {lands.map((land) => (
        <AccordionItem key={land.ulid} value={land.ulid}>
          <ProfileStatsLayout>
            <AccordionTrigger>
              <Typography textSize="large" className="text-gold-500">
                {land.name} {land.type === "LAND" ? "[деревня]" : "[поселение]"}
              </Typography>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-start gap-1">
                <div className="flex flex-col">
                  <Typography>Название: {land.name}</Typography>
                  <Typography>
                    Описание:{" "}
                    {land.title ? land.title : "Приветствуем на территории"}
                  </Typography>
                  <Typography>Баланс: {land.balance}</Typography>
                  <div className="flex flex-col">
                    <Typography>Участники:</Typography>
                    <div className="flex flex-col">
                      {land.members.map((member) => (
                        <div
                          className="flex items-center gap-2 px-1 rounded-md hover:bg-shark-50/10 py-0.5 cursor-pointer"
                          key={member.uuid}
                        >
                          <Avatar
                            propHeight={14}
                            propWidth={14}
                            nickname={member.nickname}
                          />
                          <Typography>{member.chunks} чанков</Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Typography>Налог: 5</Typography>
                  <Typography>
                    Заблокированные: {land.area.banned.length}
                  </Typography>
                </div>
              </div>
            </AccordionContent>
          </ProfileStatsLayout>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
