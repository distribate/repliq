"use client";

import { Typography } from "@repo/ui/src/components/typography.tsx";
import CharismWallet from "@repo/assets/images/minecraft/charism_wallet.png";
import BelkoinWallet from "@repo/assets/images/minecraft/belkoin_wallet.png";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { generalStatsQuery } from "#profile/components/stats/queries/general-stats-query.ts";
import { ProfileStatsLayout } from "#profile/components/stats/components/profile-stats-layout.tsx";
import { StatsRequest } from "#profile/components/stats/types/stats-types.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { SomethingError } from "#templates/something-error.tsx";

const GeneralStatsSkeleton = () => (
  <Skeleton className="flex flex-col gap-y-2 h-[400px] w-full rounded-md px-4 py-2" />
);

export const GeneralStats = ({ nickname, uuid }: StatsRequest) => {
  const { data,isLoading, isError } = generalStatsQuery({ nickname, uuid });

  if (isLoading) return <GeneralStatsSkeleton />;
  if (isError) return <SomethingError />;
  if (!data) return null;

  const { cmi, reputation, wallet } = data

  if (!cmi || !reputation || !wallet) return null;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid font-[Minecraft] grid-cols-2 grid-rows-2 gap-2 w-full h-fit">
        <ProfileStatsLayout>
          <Typography textSize="large" className="text-gold-500">
            Ник
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>Реальный ник: {cmi.username}</Typography>
            <Typography>
              Псевдоним: {cmi.displayName ? cmi.displayName : "нет"}
            </Typography>
          </div>
        </ProfileStatsLayout>
        <ProfileStatsLayout>
          <Typography textSize="large" className="text-gold-500">
            Баланс
          </Typography>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <Typography>Харизма: {cmi.balance}</Typography>
              <img
                src={CharismWallet.src}
                alt="Харизма"
                width={18}
                height={18}
              />
            </div>
            <div className="flex items-center gap-1">
              <Typography>Белкоины: {wallet.points}</Typography>
              <img
                src={BelkoinWallet.src}
                alt="Белкоин"
                width={18}
                height={18}
              />
            </div>
          </div>
        </ProfileStatsLayout>
        <ProfileStatsLayout>
          <Typography textSize="large" className="text-gold-500">
            Коллекции
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>Собрано постеров: 10/14</Typography>
            <Typography>Собрано жвачек: 0</Typography>
          </div>
        </ProfileStatsLayout>
        <ProfileStatsLayout>
          <Typography textSize="large" className="text-gold-500">
            Прочее
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>
              Наиграно:{" "}
              {dayjs.duration(Number(cmi.totalPlayTime)).asHours().toFixed()}{" "}
              часа(-ов)
            </Typography>
            <Typography>Смертей: 2</Typography>
          </div>
        </ProfileStatsLayout>
        <ProfileStatsLayout>
          <Typography textSize="large" className="text-gold-500">
            Репутация
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>
              Игровая репутация: {reputation.reputationScore}
            </Typography>
            {/*<Typography>*/}
            {/*  Лайков на тредах: 1*/}
            {/*</Typography>*/}
          </div>
        </ProfileStatsLayout>
      </div>
    </div>
  );
};
