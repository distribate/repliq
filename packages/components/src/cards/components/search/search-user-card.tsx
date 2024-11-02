import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/components/nickname.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";

export const SearchUserItem = ({ nickname, nicknameColor }: UserNickname) => {
  return (
    <Link
      href={USER_URL + nickname}
      className="flex items-center rounded-md p-2 gap-2 bg-shark-900"
    >
      <Avatar nickname={nickname} propHeight={16} propWidth={16} />
      <div className="flex items-center gap-1">
        <UserNickname
          className="text-sm"
          nickname={nickname}
          nicknameColor={nicknameColor}
        />
        <UserDonate nickname={nickname} />
      </div>
    </Link>
  );
};
