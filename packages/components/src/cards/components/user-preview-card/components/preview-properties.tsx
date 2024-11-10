'use client';

import { Ellipsis } from 'lucide-react';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { useRouter } from 'next/navigation';
import { UserCardProps } from '../user-preview-card.tsx';
import { UserCardModal } from '#modals/custom/user-card-modal.tsx';
import { USER_URL } from '@repo/shared/constants/routes.ts';

export const UserPreviewCardProperties = ({
  nickname
}: Pick<UserCardProps, "nickname">) => {
  const { replace } = useRouter();
 
  return (
    <DropdownWrapper
      properties={{ sideAlign: 'right', contentAlign: 'end' }}
      trigger={
        <Ellipsis size={16} className="text-shark-300" />
      }
      content={
        <div className="flex flex-col gap-y-1 w-full *:w-full items-center">
          <UserCardModal nickname={nickname}/>
          <HoverCardItem onClick={() => replace(USER_URL + nickname)}>
            <Typography>
              Перейти к профилю
            </Typography>
          </HoverCardItem>
          <Separator />
          <HoverCardItem>
            <Typography>
              Пожаловаться
            </Typography>
          </HoverCardItem>
        </div>
      }
    />
  );
};