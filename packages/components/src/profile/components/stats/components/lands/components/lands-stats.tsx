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
import { StatsBlockWrapper } from '../../../stats/stats-block-wrapper.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/src/components/accordion.tsx';

export const LandsStats = ({
  nickname, uuid
}: StatsRequest) => {
  return (
    <Accordion type="multiple"  className="font-[Minecraft] w-full">
      <AccordionItem value="test">
        <StatsBlockWrapper>
          <AccordionTrigger>
            <Typography textSize="large" className="text-gold-500">
              Aboba City [город]
            </Typography>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-start gap-1">
              <div className="flex flex-col">
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
          </AccordionContent>
        </StatsBlockWrapper>
      </AccordionItem>
    </Accordion>
  );
};