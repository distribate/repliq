import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { USER_URL } from "@repo/shared/constants/routes";
import { Link } from "@tanstack/react-router";
import { SearchUser } from "../queries/get-search-results";

export const SearchPageUser = ({ nickname, name_color }: SearchUser) => {
  return (
    <Link
      to={USER_URL + nickname}
      className="flex p-4 items-center gap-3 hover:bg-shark-700 w-full rounded-md"
    >
      <Avatar nickname={nickname} propWidth={40} propHeight={40} />
      <UserNickname
        nickname={nickname}
        nicknameColor={name_color}
        className="text-[18px]"
      />
    </Link>
  );
};