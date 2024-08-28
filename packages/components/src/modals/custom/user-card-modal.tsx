import { Typography } from '@repo/ui/src/components/typography.tsx';
import { USER } from '@repo/types/entities/entities-type.ts';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { ReactNode } from 'react';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { UserFullCard } from '../../cards/components/user-main-card/components/user-full-card.tsx';

export const USER_CARD_MODAL_NAME = (nickname: string) => `user-card-${nickname}`;

type UserCardModalProperties = {
  withCustomTrigger: boolean,
  trigger: ReactNode
}

type UserCardModal = Pick<USER, 'nickname'>
  & Partial<UserCardModalProperties>

export const UserCardModal = ({
  nickname, trigger, withCustomTrigger = false,
}: UserCardModal) => {
  return (
    <DialogWrapper
      properties={{
        withClose: false,
        dialogContentClassName: '!p-0 !w-[424px] !overflow-visible !border-none !bg-transparent',
      }}
      name={USER_CARD_MODAL_NAME(nickname)}
      trigger={
        withCustomTrigger ? trigger : (
          <HoverCardItem>
            <Typography>
              Показать карточку профиля
            </Typography>
          </HoverCardItem>
        )
      }
    >
      <UserFullCard nickname={nickname} />
    </DialogWrapper>
  );
};