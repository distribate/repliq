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
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { SomethingError } from "#components/templates/something-error.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Suspense } from "react";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import Charism from "@repo/assets/images/minecraft/charism_wallet.png"

const LandsStatsSkeleton = () => (
  <Skeleton className="flex flex-col h-[400px] gap-y-2 rounded-md px-4 py-2" />
);

export const LandsStats = ({ nickname }: { nickname: string }) => {
  const { data: lands, isLoading, isError } = landsStatsQuery(nickname);

  if (isLoading) return <LandsStatsSkeleton />;
  if (isError) return <SomethingError />;

  if (!lands || !lands.length) return <LandsStatsNotFound />;

  return (
    <Accordion
      defaultValue={[lands[0].ulid]}
      type="multiple"
      className="font-[Minecraft] w-full"
    >
      {lands.map((land) => (
        <AccordionItem key={land.ulid} value={land.ulid} className="mb-2">
          <ProfileStatsLayout>
            <AccordionTrigger className="py-2">
              <Typography textSize="large" className="text-gold-500">
                {land.name} {land.type === "LAND" ? "[деревня]" : "[поселение]"}
              </Typography>
            </AccordionTrigger>
            <AccordionContent className="!p-0 !m-0">
              <div className="flex flex-col gap-2">
                <Typography>
                  Название: {land.name}
                </Typography>
                <Typography>
                  Описание:{" "}
                  {land.title ? land.title : "Приветствуем на территории"}
                </Typography>
                <div className="flex items-center">
                  <Typography>
                    Баланс: {land.balance}
                  </Typography>
                  <img src={Charism} width={18} height={18} alt="" />
                </div>
                <div className="flex flex-col">
                  <Typography>Участники:</Typography>
                  <div className="flex flex-col gap-1">
                    {land.members.map(({ nickname, chunks }) => (
                      <div
                        key={nickname}
                        className="flex items-center gap-2 p-4 rounded-md bg-shark-900 w-full lg:w-2/3"
                      >
                        <Suspense fallback={<Skeleton className="w-[32px] h-[32px]" />}>
                          <Link to={USER_URL + nickname}>
                            <Avatar
                              rounded="medium"
                              className="min-w-[32px] min-h-[32px]"
                              propHeight={32}
                              propWidth={32}
                              nickname={nickname}
                            />
                          </Link>
                        </Suspense>
                        <div className="flex items-center gap-2">
                          <Link to={USER_URL + nickname}>
                            <UserNickname nickname={nickname} />
                          </Link>
                          <span className="text-shark-50 text-lg">⏺</span>
                          <Typography>
                            {chunks} чанков
                          </Typography>
                        </div>
                      </div>
                    ))}
                    {land.members.length > 5 && (
                      <Typography>
                        и еще {land.members.length - 5} участника
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </ProfileStatsLayout>
        </AccordionItem>
      ))}
    </Accordion>
  );
};