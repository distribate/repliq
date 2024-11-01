'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { StatsRequest } from '../../../types/stats-types.ts';
import { landsStatsQuery } from '../queries/lands-stats-query.ts';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { StatsBlockWrapper } from '../../../stats/stats-block-wrapper.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/src/components/accordion.tsx';
import { LandsStatsNotFound } from './lands-stats-not-found.tsx';

export const LandsStats = ({
  uuid,
}: Pick<StatsRequest, 'uuid'>) => {
  const { data: lands } = landsStatsQuery(uuid);
  
  if (!lands || !lands.length) return <LandsStatsNotFound/>
  
  return (
    <Accordion type="multiple" className="font-[Minecraft] w-full">
      {lands.map(land => (
        <AccordionItem key={land.ulid} value={land.ulid}>
          <StatsBlockWrapper>
            <AccordionTrigger>
              <Typography textSize="large" className="text-gold-500">
                {land.name} {land.type === 'LAND' ? '[деревня]' : '[поселение]'}
              </Typography>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-start gap-1">
                <div className="flex flex-col">
                  <Typography>
                    Название: {land.name}
                  </Typography>
                  <Typography>
                    Описание: {land.title ? land.title : 'Приветствуем на территории'}
                  </Typography>
                  <Typography>
                    Баланс: {land.balance}
                  </Typography>
                  <div className="flex flex-col">
                    <Typography>
                      Участники:
                    </Typography>
                    <div className="flex flex-col">
                      {land.members.map(member => (
                        <div
                          className="flex items-center gap-2 px-1 rounded-md hover:bg-shark-50/10 py-0.5 cursor-pointer"
                          key={member.uuid}
                        >
                          <Avatar
                            propHeight={14}
                            propWidth={14}
                            nickname={member.nickname}
                          />
                          <Typography>
                            {member.chunks} чанков
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Typography>
                    Налог: 5
                  </Typography>
                  <Typography>
                    Заблокированные: {land.area.banned.length}
                  </Typography>
                </div>
              </div>
            </AccordionContent>
          </StatsBlockWrapper>
        </AccordionItem>
      ))}
    </Accordion>
  );
};