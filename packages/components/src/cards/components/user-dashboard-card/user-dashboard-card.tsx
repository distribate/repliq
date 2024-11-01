import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Grip } from 'lucide-react';
import { DropdownWrapper } from '../../../wrappers/dropdown-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useRouter } from 'next/navigation';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { UserEntity } from '@repo/types/entities/entities-type.ts';

type UserDashboardCardProps = Pick<UserEntity, 'nickname'
  | 'id' | 'uuid' | 'name_color' | 'created_at'
>

export const UserDashboardCard = ({
  nickname, id, uuid, name_color, created_at,
}: UserDashboardCardProps) => {
  const { push } = useRouter();
  
  return (
    <div className="flex items-center justify-between w-full p-2 cursor-pointer bg-player-background/20 rounded-[8px]">
      <div className="flex items-center gap-2">
        <Avatar nickname={nickname} propHeight={18} propWidth={18} />
        <Typography>{nickname}</Typography>
      </div>
      <div className="w-fit">
        <DropdownWrapper
          properties={{ sideAlign: "left", contentAlign: "start" }}
          trigger={<Grip size={20} className="cursor-pointer text-shark-400" />}
          content={
            <div className="flex flex-col gap-2 w-full h-full">
              <HoverCardItem onClick={() => push(USER_URL + nickname)}>
                <Typography>
                  К профилю
                </Typography>
              </HoverCardItem>
              <Separator/>
              <HoverCardItem>
                <Typography>
                  Предупреждение
                </Typography>
              </HoverCardItem>
              <HoverCardItem>
                <Typography>
                  Заблокировать
                </Typography>
              </HoverCardItem>
              <Separator/>
              <HoverCardItem>
                <Typography className="text-red-500">
                  Завершить сессию
                </Typography>
              </HoverCardItem>
            </div>
          }
        />
      </div>
    </div>
  );
};