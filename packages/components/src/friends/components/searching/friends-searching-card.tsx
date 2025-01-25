import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useNavigate } from "@tanstack/react-router";
import { FriendButton } from "#buttons/friend-button.tsx";
import { UserEntity } from "@repo/types/entities/entities-type";
import { getUser } from "@repo/lib/helpers/get-user";

export type FriendsSearchingCardProps = Pick<
  UserEntity,
  "nickname" | "name_color" | "description"
>;

export const FriendsSearchingCard = ({
  nickname,
  name_color,
  description,
}: FriendsSearchingCardProps) => {
  const navigate = useNavigate();
  const currentUser = getUser();

  return (
    <div className="flex flex-col group gap-4 justify-between items-center lg:h-[280px] friend-card">
      <Avatar nickname={nickname} propWidth={128} propHeight={128} />
      <div className="flex flex-col items-start gap-1 w-full justify-start">
        <div className="flex items-center gap-2">
          <UserNickname nickname={nickname} nicknameColor={name_color} />
        </div>
        <div className="flex items-center w-full">
          {description && (
            <Typography textSize="small" className="text-shark-300 truncate">
              {description}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex lg:flex-row flex-col items-center gap-2 *:w-full w-full">
        {nickname !== currentUser.nickname ? (
          <FriendButton recipient={nickname} />
        ) : (
          <Button
            state="default"
          >
            Это вы
          </Button>
        )}
        <Button
          state="default"
          className="lg:!w-2/5"
          onClick={() => navigate({ to: USER_URL + nickname })}
        >
          К профилю
        </Button>
      </div>
    </div>
  );
};
