import { SearchUser } from "#components/sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { USER_URL } from "@repo/shared/constants/routes";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";

export const SearchPageUser = ({ nickname, name_color }: SearchUser) => {
  return (
    <Link
      to={USER_URL + nickname}
      className="flex p-4 items-center gap-3 hover:bg-shark-700 w-full rounded-md"
    >
      <Suspense fallback={<Skeleton className="w-[40px] h-[40px]" />}>
        <Avatar nickname={nickname} propWidth={40} propHeight={40} />
      </Suspense>
      <UserNickname
        nickname={nickname}
        nicknameColor={name_color}
        className="text-[18px]"
      />
    </Link>
  );
};