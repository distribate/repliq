import dayjs from "@repo/shared/constants/dayjs-instance";
import { userBlockedAction } from "#components/modals/user-settings/models/user-blocked.model";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { onConnect, onDisconnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Avatar } from '#components/user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#components/user/components/name/nickname.tsx';
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Ellipsis } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { UserCardModal } from '#components/modals/custom/user-card-modal.tsx';
import { deleteFromBlockedAction } from "../models/user-blocked.model.ts";
import { createIdLink } from "#shared/helpers/create-link.ts";
import { navigate } from "vike/client/router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { SectionSkeleton } from "#components/templates/components/section-skeleton.tsx";

type UserBlockedCardProps = {
  nickname: string,
  avatar: string | null,
  name_color: string
  time: string;
};

const UserBlockedCard = reatomComponent<UserBlockedCardProps>(({
  ctx, avatar, name_color, nickname, time
}) => {
  const handle = (e: React.MouseEvent<HTMLDivElement>, nickname: string) => {
    e.preventDefault();
    deleteFromBlockedAction(ctx, nickname)
  };

  const dateBy = dayjs(time).format("DD.MM.YYYY HH:mm")

  return (
    <div className="flex items-start justify-between w-full bg-shark-900 rounded-lg border border-white/10 p-2">
      <div className="flex items-center gap-2 w-fit aspect-square min-h-12 h-12 max-h-12">
        <Avatar
          url={avatar}
          nickname={nickname}
          propWidth={48}
          propHeight={48}
          className="aspect-square min-h-12 h-12 max-h-12"
        />
        <UserNickname
          nickname={nickname}
          nicknameColor={name_color}
        />
        <Separator orientation="vertical" />
        <Typography textSize="small" className="text-shark-300">
          добавлен {dateBy}
        </Typography>
      </div>
      <div className="w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis size={18} className="text-shark-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-y-1 w-full *:w-full items-center">
              <HoverCardItem
                onClick={e => handle(e, nickname)}
              >
                <Typography>
                  Удалить из черного списка
                </Typography>
              </HoverCardItem>
              <Separator />
              <HoverCardItem
                onClick={() => navigate(createIdLink("user", nickname))}
              >
                <Typography>
                  Перейти к профилю
                </Typography>
              </HoverCardItem>
              <UserCardModal nickname={nickname} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}, "UserBlockedCard")

onConnect(userBlockedAction.dataAtom, userBlockedAction)
onDisconnect(userBlockedAction.dataAtom, (ctx) => userBlockedAction.dataAtom.reset(ctx))

export const BlockedList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(userBlockedAction.dataAtom)
  const isLoading = ctx.spy(userBlockedAction.statusesAtom).isPending
  const isExist = data && data.length >= 1

  if (isLoading) {
    return <SectionSkeleton />
  }

  if (!isExist) {
    return <ContentNotFound title="Никого нет в черном списке" />
  }

  return (
    <div className="flex flex-col gap-1 w-full overflow-y-scroll max-h-[600px]">
      {data.map((user) => (
        <UserBlockedCard
          key={user.id}
          avatar={user.avatar}
          name_color={user.name_color}
          nickname={user.nickname}
          time={user.created_at}
        />
      ))}
    </div>
  );
}, "BlockedList")