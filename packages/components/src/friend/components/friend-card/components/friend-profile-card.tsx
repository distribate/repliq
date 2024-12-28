import { Typography } from "@repo/ui/src/components/typography.tsx";
import Link from "next/link";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserCardModal } from "#modals/custom/user-card-modal.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { type FriendWithDetails } from "@repo/types/schemas/friend/friend-types";
import { Button } from "@repo/ui/src/components/button";

export const FriendProfileCard = ({
  nickname, name_color, donate, favorite_item
}: FriendWithDetails) => {
  return (
    <div className="flex flex-col gap-y-4 w-full bg-shark-950 *:px-4 py-4 rounded-lg">
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-2 w-full items-center">
          <Avatar propHeight={56} propWidth={56} nickname={nickname} />
          <div className="flex flex-col gap-1">
            <Link href={USER_URL + nickname}>
              <UserNickname 
                nickname={nickname}
                nicknameColor={name_color}
                className="text-[18px] font-medium text-shark-50"
              />
            </Link>
            <UserDonate donate={donate} favoriteItemId={Number(favorite_item)} />
          </div>
        </div>
      </div>
      <UserCardModal
        nickname={nickname} 
        withCustomTrigger={true}
        trigger={
          <Button variant="positive" className="hover:bg-[#05b458] bg-[#088d47] w-full">
            <Typography textColor="shark_white" className="text-[16px]">
              Показать карточку профиля
            </Typography>
          </Button>
        } 
      />
    </div>
  );
};