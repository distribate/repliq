'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { StatsRequest } from '../../../types/stats-types.ts';
import { ImageWrapper } from '../../../../../../wrappers/image-wrapper.tsx';
import CharismWallet from '@repo/assets/images/minecraft/charism_wallet.png';
import BelkoinWallet from '@repo/assets/images/minecraft/belkoin_wallet.png';
import { ReactNode } from 'react';
import { StatsBlockWrapper } from '../../../stats/stats-block-wrapper.tsx';

export const GeneralStats = ({
  nickname, uuid
}: StatsRequest) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid font-[Minecraft] grid-cols-2 grid-rows-2 gap-2 w-full h-fit">
        <StatsBlockWrapper>
          <Typography textSize="large" className="text-gold-500">
            Ник
          </Typography>
          <div className="flex flex-col w-full">
            <Typography>
              Реальный ник: {nickname}
            </Typography>
            <Typography>
              Псевдоним: нет
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
                Харизма: 2
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
                Белкоины: 600
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
              Наиграно: 505 часов
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
              Игровая репутация: 5
            </Typography>
            <Typography>
              Лайков на тредах: 1
            </Typography>
          </div>
        </StatsBlockWrapper>
      </div>
    </div>
  );
};