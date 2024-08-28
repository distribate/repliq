'use client';

import { keyValueExtractor } from '@repo/lib/helpers/key-value-extractor.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { StatsRequest } from '../../../types/stats-types.ts';
import { generalStatsQuery } from '../queries/general-stats-query.ts';
import { GeneralStatsSkeleton } from './general-stats-skeleton.tsx';
import { ImageWrapper } from '../../../../../../wrappers/image-wrapper.tsx';
import CharismWallet from '@repo/assets/images/minecraft/charism_wallet.png';
import BelkoinWallet from '@repo/assets/images/minecraft/belkoin_wallet.png';
import { Separator } from '@repo/ui/src/components/separator.tsx';

export const GeneralStats = ({
  nickname, uuid,
}: StatsRequest) => {
  // const { data: generalStats, isLoading } = generalStatsQuery({
  //   nickname: nickname,
  //   uuid: uuid,
  // });
 
  // const extractedData = keyValueExtractor(
  //   generalStats?.cmi?.usermeta,
  // );

  // const collectionPosters = extractedData ? extractedData['collection_posters'] : 0;
  //
  // const cmiData = generalStats?.cmi;
  // const repData = generalStats?.rep;
  // const pointsData = generalStats?.points;
  
  // if (isLoading) return <GeneralStatsSkeleton />;
 
  // if (!cmiData || !repData || !pointsData) return null;
  
  return (
    <div className="grid font-[Minecraft] grid-cols-2 grid-rows-2 gap-2 w-full h-fit">
      <div className="flex flex-col w-full gap-y-1 rounded-lg bg-shark-950 border border-white/10 p-2">
        <Typography textSize="large" className="font-[600]">
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
      </div>
      <div className="flex flex-col w-full gap-y-1 rounded-lg bg-shark-950 border border-white/10 p-2">
        <Typography textSize="large" className="font-[600]">
          Баланс
        </Typography>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <ImageWrapper
              propSrc={CharismWallet.src}
              propAlt="Харизма"
              width={18}
              height={18}
            />
            <Typography>
              Харизма: 2
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <ImageWrapper
              propSrc={BelkoinWallet.src}
              propAlt="Белкоин"
              width={18}
              height={18}
            />
            <Typography>
              Белкоины: 600
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-y-1 rounded-md bg-shark-950 border border-white/10 p-2">
        <Typography textSize="large" className="font-[600]">
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
      </div>
      <div className="flex flex-col w-full gap-y-1 rounded-md bg-shark-950 border border-white/10 p-2">
        <Typography textSize="large" className="font-[600]">
          Прочее
        </Typography>
        <div className="flex flex-col w-full">
          <Typography>
            Наиграно часов: 505
          </Typography>
        </div>
      </div>
      <div className="flex flex-col w-full gap-y-1 rounded-md bg-shark-950 border border-white/10 p-2">
        <Typography textSize="large" className="font-[600]">
          Прочее
        </Typography>
        <div className="flex flex-col w-full">
          <Typography>
            Репутации: 5
          </Typography>
        </div>
      </div>
    </div>
  );
};