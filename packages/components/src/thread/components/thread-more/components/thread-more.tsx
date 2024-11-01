'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/src/components/accordion.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dayjs from '@repo/lib/utils/dayjs/dayjs-instance.ts';
import { useState } from 'react';
import { ThreadModel } from '../../../queries/get-thread-model.ts';
import Link from 'next/link';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { Avatar } from '../../../../user/components/avatar/components/avatar.tsx';
import { UserNickname } from '../../../../user/components/name/components/nickname.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { useRouter } from 'next/navigation';

type ThreadMoreProps = Pick<ThreadModel, 'threadTags'
  | 'description'
  | 'created_at'
  | 'nickname'
>

export const ThreadMore = ({
  threadTags, description, created_at, nickname,
}: ThreadMoreProps) => {
  const [ expand, setExpand ] = useState<boolean>(false);
  const { push } = useRouter()
  
  return (
    <Accordion value={expand ? "more" : "."} type="single" collapsible className="w-full p-0 m-0">
      <AccordionItem value="more" className="w-full px-4">
        <AccordionTrigger
          className="flex items-center justify-start gap-4 w-full"
          onClick={() => setExpand(prev => !prev)}
        >
          <Typography>
            {dayjs(created_at).fromNow()}
          </Typography>
          {threadTags && (
            <div className="flex items-center gap-2">
              {threadTags.map((tag, idx) => (
                <Typography key={idx} className="text-caribbean-green-300">
                  #{tag}
                </Typography>
              ))}
            </div>
          )}
        </AccordionTrigger>
        <AccordionContent>
          {description && (
            <Typography textSize="large" textColor="shark_white" className="mb-6">
              {description}
            </Typography>
          )}
          <div className="flex flex-col mt-2 mb-6 gap-y-4 w-full">
            <div className="flex items-center gap-2 w-fit">
              <Link href={USER_URL + nickname}>
                <Avatar nickname={nickname} propWidth={36} propHeight={36} />
              </Link>
              <div className="flex flex-col w-fit">
                <Link href={USER_URL + nickname}>
                  <UserNickname nickname={nickname} />
                </Link>
                <Typography textSize="small" textColor="gray">
                  2 треда
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Button onClick={() => push(USER_URL + nickname)} state="default">
                <Typography>
                  Профиль
                </Typography>
              </Button>
              <Button onClick={() => push(`/search?type=threads&user=${nickname}`)} state="default">
                <Typography>
                  Треды
                </Typography>
              </Button>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setExpand(false)}
          >
            <Typography textSize="medium">
              Скрыть
            </Typography>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};