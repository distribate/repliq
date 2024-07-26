'use client';

import { keyValueExtractor } from '@repo/lib/helpers/key-value-extractor.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { CornerDownRight } from 'lucide-react';
import { StatsRequest } from '../../../types/stats-types.ts';
import { generalStatsQuery } from '../queries/general-stats-query.ts';
import { GeneralStatsSkeleton } from './general-stats-skeleton.tsx';
import { BlockWrapper } from '../../../../../../wrappers/block-wrapper.tsx';
import { ImageWrapper } from '../../../../../../wrappers/image-wrapper.tsx';
import GeneralPreview from '@repo/assets/images/general-preview.jpg';

export const GeneralStats = ({
  nickname, uuid,
}: StatsRequest) => {
  // const { data: generalStats, isLoading } = generalStatsQuery({
  //   nickname: nickname,
  //   uuid: uuid,
  // });
  //
  // const extractedData = keyValueExtractor(
  //   generalStats?.cmi?.usermeta,
  // );
  //
  // const collectionPosters = extractedData ? extractedData['collection_posters'] : 0;
  //
  // const cmiData = generalStats?.cmi;
  // const repData = generalStats?.rep;
  // const pointsData = generalStats?.points;
  //
  // if (isLoading) return <GeneralStatsSkeleton />;
  //
  // if (!cmiData || !repData || !pointsData) return null;
  
  return (
    <div className="flex items-center *:border justify-between w-full overflow-hidden bg-shark-900 rounded-md">
      <div className="flex flex-col gap-y-2 h-full p-4 w-full">
        <Typography>
          Ник: {nickname}
        </Typography>
        <div className="flex flex-col gap-y-1">
          <Typography>
            Баланс:
          </Typography>
          <div className="flex items-start gap-1">
            <CornerDownRight size={20} />
            <div className="flex flex-col gap-y-1">
              {/*<Typography>*/}
              {/*  Харизма: {cmiData?.balance}*/}
              {/*</Typography>*/}
              <Typography>
                Харизма: 5
              </Typography>
              {/*<Typography>*/}
              {/*  Белкоины: {pointsData?.points}*/}
              {/*</Typography>*/}
              <Typography>
                Белкоины: 600
              </Typography>
            </div>
          </div>
          {/*<Typography>*/}
          {/*  Собрано постеров: {collectionPosters}/14*/}
          {/*</Typography>*/}
          <Typography>
            Собрано постеров: 10/14
          </Typography>
          {/*<Typography>*/}
          {/*  Репутации: {repData?.reputation}*/}
          {/*</Typography>*/}
          <Typography>
            Репутации: 5
          </Typography>
          {/*<Typography>*/}
          {/*  Наиграно часов: {cmiData?.totalPlaytime}*/}
          {/*</Typography>*/}
          <Typography>
            Наиграно часов: 505
          </Typography>
        </div>
      </div>
      <div className="flex rounded-md min-h-full max-h-full h-fit relative -right-40 w-full overflow-hidden">
        <ImageWrapper
          propSrc={GeneralPreview.src}
          propAlt={`General Stats`}
          width={800}
          height={800}
          className="min-h-[320px] h-full"
        />
      </div>
    </div>
  );
};