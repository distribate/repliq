import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Link, useNavigate } from "@tanstack/react-router";
import { UserEntity } from "@repo/types/entities/entities-type";
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";

export type FriendsSearchingCardProps = Pick<UserEntity, "nickname"> & (
  { type: "byLands"; land: string, friend?: never }
  |
  { type: "byFriends"; friend: string, land?: never }
);

export const FriendsSearchingCard = ({
  nickname, type, land, friend
}: FriendsSearchingCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col group gap-2 justify-between items-center lg:h-[280px] friend-card">
      <Suspense fallback={<Skeleton className="w-[128px] h-[128px]" />}>
        <Link to={USER_URL + nickname}>
          <Avatar nickname={nickname} propWidth={128} propHeight={128} />
        </Link>
      </Suspense>
      <div className="flex flex-col items-start gap-1 w-full justify-start">
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname} />
        </Link>
      </div>
      <div className="flex flex-col items-center gap-2 *:w-full w-full">
        <Button
          variant="positive"
          onClick={() => navigate({ to: USER_URL + nickname })}
        >
          <Typography textSize="medium">
            К профилю
          </Typography>
        </Button>
        <div className="flex items-center rounded-md justify-start p-2 bg-shark-800">
          {type === 'byLands' ? (
            `Из региона ${land}`
          ) : (
            <div className="flex items-center gap-2 ">
              <Typography textSize="medium">
                Общий друг с
              </Typography>
              <div className="flex items-center gap-1">
                <Suspense fallback={<Skeleton className="w-[20px] h-[20px]" />}>
                  <Link to={USER_URL + friend}>
                    <Avatar nickname={friend} propWidth={20} propHeight={20} />
                  </Link>
                </Suspense>
                <Link to={USER_URL + friend}>
                  <Typography textSize="medium">
                    {friend}
                  </Typography>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};