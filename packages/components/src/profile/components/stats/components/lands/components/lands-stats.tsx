'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { CornerDownRight } from 'lucide-react';
import { StatsRequest } from '../../../types/stats-types.ts';
import { landsStatsQuery } from '../queries/lands-stats-query.ts';
import { LandsStatsSkeleton } from './lands-stats-skeleton.tsx';
import { Avatar } from '../../../../../../user/components/avatar/components/avatar.tsx';
import { BlockWrapper } from '../../../../../../wrappers/block-wrapper.tsx';
import { StatsLayout } from '../../../stats/stats-layout.tsx';
import LandsPreview from '@repo/assets/images/minecraft/bust_painting.webp';

export const LandsStats = ({
  nickname, uuid,
}: StatsRequest) => {
  return (
    <div className="flex flex-col font-[Minecraft] w-full gap-y-1 rounded-md bg-shark-950 border border-white/10 p-2">
      <Typography>
        #1 Aboba City [город]
      </Typography>
      <div className="flex items-start gap-1">
        <div className="flex flex-col ml-2">
          <Typography>
            Название: Территория
          </Typography>
          <Typography>
            Описание: Приветствуем на территории
          </Typography>
          <Typography>
            Баланс: 50
          </Typography>
          <div className="flex flex-col">
            <Typography>
              Участники:
            </Typography>
            <div className="flex flex-col">
              <div
                className="flex items-center gap-2 px-1 rounded-md hover:bg-shark-50/10 py-0.5 cursor-pointer"
                key={'key-test-unique'}
              >
                <Avatar
                  propHeight={14}
                  propWidth={14}
                  nickname="discludness"
                />
                <Typography>
                  5 чанков
                </Typography>
              </div>
            </div>
          </div>
          <Typography>
            Налог: 5
          </Typography>
          <Typography>
            Заблокированные: 1
          </Typography>
        </div>
      </div>
    </div>
  );
};