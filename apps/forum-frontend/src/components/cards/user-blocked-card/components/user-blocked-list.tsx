import { userBlockedAction } from "#components/modals/user-settings/models/user-blocked.model";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { onConnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Avatar } from '#components/user/avatar/components/avatar.tsx';
import { UserNickname } from '#components/user/name/nickname.tsx';
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "dayjs";
import { Ellipsis } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { UserCardModal } from '#components/modals/custom/components/user-card-modal.tsx';
import { deleteFromBlockedAction } from "../models/blocked.model.ts";
import { createIdLink } from "@repo/lib/utils/create-link.ts";
import { navigate } from "vike/client/router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";

type UserBlockedCardProps = {
  nickname: string,
  avatar: string | null,
  name_color: string
  time: string;
};

const UserBlockedCard = reatomComponent<UserBlockedCardProps>(({ ctx, avatar, name_color, nickname, time, }) => {
  const handleDeleteFromBlocked = (e: React.MouseEvent<HTMLDivElement>, nickname: string) => {
    e.preventDefault();

    return deleteFromBlockedAction(ctx, nickname)
  };

  return (
    <div className="flex items-start justify-between w-full bg-shark-900 rounded-lg border border-white/10 p-2">
      <div className="flex items-center gap-2 w-fit">
        <Avatar url={avatar} nickname={nickname} propWidth={48} propHeight={48} />
        <UserNickname nickname={nickname} nicknameColor={name_color} />
        <Separator orientation="vertical" />
        <Typography textSize="small" className="text-shark-300">
          добавлен {dayjs(time).format("DD.MM.YYYY HH:mm")}
        </Typography>
      </div>
      <div className="w-fit">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Typography>
              <Ellipsis size={18} className="text-shark-300" />
            </Typography>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col gap-y-1 w-full *:w-full items-center">
              <HoverCardItem
                onClick={e => handleDeleteFromBlocked(e, nickname)}
              >
                <Typography>Удалить из черного списка</Typography>
              </HoverCardItem>
              <Separator />
              <HoverCardItem onClick={() => navigate(createIdLink("user", nickname))}>
                <Typography>Перейти к профилю</Typography>
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

export const BlockedList = reatomComponent(({ ctx }) => {
  const usersBlocked = ctx.spy(userBlockedAction.dataAtom)
  const isLoading = ctx.spy(userBlockedAction.statusesAtom).isPending

  return (
    <>
      <div className="flex flex-col gap-y-1 w-full overflow-y-scroll max-h-[600px]">
        {isLoading && (
          <>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </>
        )}
        {(!isLoading && usersBlocked) && (
          usersBlocked.map((user) => (
            <UserBlockedCard
              key={user.id}
              avatar={user.avatar}
              name_color={user.name_color!}
              nickname={user.nickname!}
              time={user.created_at!}
            />
          ))
        )}
        {!isLoading && !usersBlocked && (
          <ContentNotFound title="Никого нет в черном списке" />
        )}
      </div>
    </>
  );
}, "BlockedList")