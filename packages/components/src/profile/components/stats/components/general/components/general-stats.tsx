'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { StatsRequest } from '../../../types/stats-types.ts';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import CharismWallet from '@repo/assets/images/minecraft/charism_wallet.png';
import BelkoinWallet from '@repo/assets/images/minecraft/belkoin_wallet.png';
import { StatsBlockWrapper } from '../../../stats/stats-block-wrapper.tsx';
import { generalStatsQuery } from '../queries/general-stats-query.ts';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';

export const GeneralStats = ({
  nickname, uuid
}: StatsRequest) => {
  const { data: user } = generalStatsQuery({
    nickname, uuid
  })
  
  if (!user) return;
  
  const cmi = user.cmi;
  const wallet = user.wallet;
  const reputation = user.reputation;
  
  if (!cmi || !reputation || !wallet) return;
  
  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid font-[Minecraft] grid-cols-2 grid-rows-2 gap-2 w-full h-fit">
        <StatsBlockWrapper>
          <Typography textSize="large" className="text-gold-500">
            Ник
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>
              Реальный ник: {cmi.username}
            </Typography>
            <Typography>
              Псевдоним: {cmi.displayName ? cmi.displayName : "нет"}
            </Typography>
          </div>
        </StatsBlockWrapper>
        <StatsBlockWrapper>
          <Typography textSize="large" className="text-gold-500">
            Баланс
          </Typography>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <Typography>
                Харизма: {cmi.balance}
              </Typography>
              <ImageWrapper
                propSrc={CharismWallet.src}
                propAlt="Харизма"
                width={18}
                height={18}
              />
            </div>
            <div className="flex items-center gap-1">
              <Typography>
                Белкоины: {wallet.points}
              </Typography>
              <ImageWrapper
                propSrc={BelkoinWallet.src}
                propAlt="Белкоин"
                width={18}
                height={18}
              />
            </div>
          </div>
        </StatsBlockWrapper>
        <StatsBlockWrapper>
          <Typography textSize="large" className="text-gold-500">
            Коллекции
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>
              Собрано постеров: 10/14
            </Typography>
            <Typography>
              Собрано жвачек: 0
            </Typography>
          </div>
        </StatsBlockWrapper>
        <StatsBlockWrapper>
          <Typography textSize="large" className="text-gold-500">
            Прочее
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>
              Наиграно: {dayjs.duration(Number(cmi.totalPlayTime)).asHours().toFixed()} часа(-ов)
            </Typography>
            <Typography>
              Смертей: 2
            </Typography>
          </div>
        </StatsBlockWrapper>
        <StatsBlockWrapper>
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
        </StatsBlockWrapper>
      </div>
    </div>
  );
};