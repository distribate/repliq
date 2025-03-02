import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { UserCardModal } from "#components/modals/custom/user-card-modal.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserDonate } from "#components/user/donate/components/donate.tsx";
import { type FriendWithDetails } from "@repo/types/schemas/friend/friend-types";
import { Button } from "@repo/ui/src/components/button";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";

export const FriendProfileCard = ({
  nickname, name_color, donate, favorite_item
}: FriendWithDetails) => {
  return (
    <div className="flex flex-col gap-y-4 w-full bg-shark-950 *:px-4 py-4 rounded-lg">
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-2 w-full items-center">
          <Suspense fallback={<Skeleton className="w-[56px] h-[56px]" />}>
            <Avatar propHeight={56} propWidth={56} nickname={nickname} />
          </Suspense>
          <div className="flex flex-col gap-1">
            <Link to={USER_URL + nickname}>
              <UserNickname
                nickname={nickname}
                nicknameColor={name_color}
                className="text-[18px] font-medium text-shark-50"
              />
            </Link>
            <UserDonate donate={donate} />
          </div>
        </div>
      </div>
      <div className="flex justify-start w-full gap-2 items-center">
        <UserCardModal
          nickname={nickname}
          withCustomTrigger={true}
          trigger={
            <Button variant="positive" className="hover:bg-[#05b458] bg-[#088d47]">
              <Typography textColor="shark_white" className="text-[16px]">
                Карточка профиля
              </Typography>
            </Button>
          }
        />
      </div>
    </div>
  );
};