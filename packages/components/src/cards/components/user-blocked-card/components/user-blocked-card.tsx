import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { useRouter } from "next/navigation";
import { Avatar } from "../../../../user/components/avatar/components/avatar.tsx";
import { UserNickname } from "../../../../user/components/name/components/nickname.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "dayjs";
import { DropdownWrapper } from "../../../../wrappers/dropdown-wrapper.tsx";
import { Ellipsis } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { useDeleteFromBlocked } from "../hooks/use-delete-from-blocked.ts";
import { UserCardModal } from "../../../../modals/custom/user-card-modal.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";

type UserBlockedCardProps = Pick<UserEntity, "nickname" | "name_color"> & {
  time: string;
};

export const UserBlockedCard = ({
  name_color,
  nickname,
  time,
}: UserBlockedCardProps) => {
  const { deleteUserFromBlockedMutation } = useDeleteFromBlocked();
  const { replace } = useRouter();

  const handleDeleteFromBlocked = (
    e: React.MouseEvent<HTMLDivElement>,
    nickname: string,
  ) => {
    e.preventDefault();

    deleteUserFromBlockedMutation.mutate({
      targetUserNickname: nickname,
    });
  };

  return (
    <div className="flex items-start justify-between w-full bg-shark-900 rounded-lg border border-white/10 p-2">
      <div className="flex items-center gap-2 w-fit">
        <Avatar nickname={nickname} propWidth={48} propHeight={48} />
        <UserNickname nickname={nickname} nicknameColor={name_color} />
        <Separator orientation="vertical" />
        <Typography textSize="small" className="text-shark-300">
          {dayjs(time).format("DD.MM.YYYY HH:mm")}
        </Typography>
      </div>
      <div className="w-fit">
        <DropdownWrapper
          trigger={
            <Typography>
              <Ellipsis size={18} className="text-shark-300" />
            </Typography>
          }
          content={
            <div className="flex flex-col gap-y-1 w-full *:w-full items-center">
              <HoverCardItem
                onClick={(e) => handleDeleteFromBlocked(e, nickname)}
              >
                <Typography>Удалить из черного списка</Typography>
              </HoverCardItem>
              <Separator />
              <HoverCardItem onClick={() => replace(USER_URL + nickname)}>
                <Typography>Перейти к профилю</Typography>
              </HoverCardItem>
              <UserCardModal nickname={nickname} />
            </div>
          }
        />
      </div>
    </div>
  );
};
