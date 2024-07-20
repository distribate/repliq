import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserFullCard } from '../cards/components/user-main-card/components/user-full-card.tsx';
import { USER } from '@repo/types/entities/entities-type.ts';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';

export const USER_CARD_MODAL_NAME = (nickname: string) => `user-card-${nickname}`

type UserCardModal = Pick<USER, "nickname">

export const UserCardModal = ({
  nickname
}: UserCardModal) => {
  return (
    <DialogWrapper
      properties={{ withClose: false, dialogContentClassName: "!p-0 !w-[424px] !border-none !bg-transparent" }}
      name={USER_CARD_MODAL_NAME(nickname)}
      trigger={
        <HoverCardItem>
          <Typography>
            Показать карточку профиля
          </Typography>
        </HoverCardItem>
      }
    >
      <UserFullCard nickname={nickname}/>
    </DialogWrapper>
  )
}