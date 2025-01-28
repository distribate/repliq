import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { MoreWrapper } from "#wrappers/more-wrapper.tsx";
import { Tag, Trash } from "lucide-react";
import { DeleteFriendModal } from "#modals/action-confirmation/components/delete-friend/components/delete-friend-modal.tsx";
import { UserCardModal } from "#modals/custom/user-card-modal.tsx";
import { FriendCardControlNote } from "./friend-card-control-note.tsx";
import { useNavigate } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { FriendCardControlPin } from "#friend/components/friend-card/components/friend-card-control-pin.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";

export type FriendCardControlProps = Pick<FriendWithDetails, "friend_id" | "nickname" | "is_pinned">;

export const FriendCardControl = ({
  nickname, friend_id, is_pinned,
}: FriendCardControlProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mt-2 gap-1 w-fit">
      <Button
        className="h-8 px-4"
        variant="positive"
        onClick={() => navigate({ to: USER_URL + nickname })}
      >
        <Typography textSize="small">
          К профилю
        </Typography>
      </Button>
      <MoreWrapper
        properties={{
          sideAlign: "right",
          contentAlign: "start",
          contentAsChild: true,
          contentClassname: "w-[250px]",
        }}
      >
        <UserCardModal
          nickname={nickname}
          withCustomTrigger={true}
          trigger={
            <HoverCardItem className="flex justify-start items-center gap-2 group">
              <Tag size={16} className="text-shark-300" />
              <Typography textSize="small">
                Показать карточку профиля
              </Typography>
            </HoverCardItem>
          }
        />
        <FriendCardControlPin nickname={nickname} friend_id={friend_id} is_pinned={is_pinned} />
        <FriendCardControlNote nickname={nickname} friend_id={friend_id} />
        <Separator />
        <DeleteFriendModal
          friend_id={friend_id}
          nickname={nickname}
          trigger={
            <HoverCardItem className="flex justify-start items-center gap-2 group">
              <Trash size={16} className="text-red-500" />
              <Typography textSize="small" className="text-red-500">
                Удалить из друзей
              </Typography>
            </HoverCardItem>
          }
        />
      </MoreWrapper>
    </div>
  );
};