import { Typography } from "@repo/ui/src/components/typography.tsx";
import CharismWallet from "@repo/assets/images/minecraft/charism_wallet.png";
import BelkoinWallet from "@repo/assets/images/minecraft/belkoin_wallet.png";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { generalStatsResource } from "#components/profile/stats/models/general-stats.model";
import { ProfileStatsLayout } from "#components/profile/stats/components/profile-stats-layout.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { SomethingError } from "#components/templates/components/something-error";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/requested-user.model";

const GeneralStatsSkeleton = () => (
  <Skeleton className="flex flex-col gap-y-2 h-[400px] w-full rounded-md px-4 py-2" />
);

export const GeneralStats = reatomComponent(({ ctx }) => {
  const data = ctx.spy(generalStatsResource.dataAtom)
  const isLoading = ctx.spy(generalStatsResource.statusesAtom).isPending
  const isError = ctx.spy(generalStatsResource.statusesAtom).isRejected

  if (isLoading) return <GeneralStatsSkeleton />;
  if (isError) return <SomethingError />;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid font-[Minecraft] grid-cols-2 grid-rows-2 gap-2 w-full h-fit">
        <ProfileStatsLayout>
          <Typography textSize="large" className="text-gold-500">
            Ник
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>Реальный ник: {ctx.spy(requestedUserParamAtom)}</Typography>
            <Typography>
              Псевдоним: {data?.displayName ? data?.displayName : "нет"}
            </Typography>
          </div>  
        </ProfileStatsLayout>
        <ProfileStatsLayout>
          <Typography textSize="large" className="text-gold-500">
            Баланс
          </Typography>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <Typography>Харизма: {data?.charism}</Typography>
              <img
                src={CharismWallet}
                alt="Харизма"
                width={18}
                height={18}
              />
            </div>
            <div className="flex items-center gap-1">
              <Typography>Белкоины: {data?.belkoin}</Typography>
              <img
                src={BelkoinWallet}
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
              {data?.totalPlaytime
                ? dayjs.duration(Number(data?.totalPlaytime)).asHours().toFixed()
                : "0"}{" "}
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
              Игровая репутация: {data?.reputation}
            </Typography>
            {/*<Typography>*/}
            {/*  Лайков на тредах: 1*/}
            {/*</Typography>*/}
          </div>
        </ProfileStatsLayout>
      </div>
    </div>
  );
}, "GeneralStats")