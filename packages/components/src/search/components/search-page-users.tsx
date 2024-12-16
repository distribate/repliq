"use client";

import { searchPageQuery } from "#search/queries/search-page-query.ts";
import { ContentNotFound } from "#templates/content-not-found.tsx";
import { SearchUser } from "#sidebar/desktop/components/sidebar-content/search/queries/search-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { filterSearchResults } from "#search/helpers/filter-search-results.ts";

export const SearchPageUser = ({ nickname, name_color }: SearchUser) => {
  return (
    <Link
      href={USER_URL + nickname}
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

export const SearchPageUsers = () => {
  const { data: searchState } = searchPageQuery();

  if (!searchState.results)
    return <ContentNotFound title="Ничего не найдено" />;

  const users = filterSearchResults<SearchUser>(searchState.results, "users");

  return (
    <div className="flex flex-col gap-y-4 w-full h-fit">
      <Typography variant="pageTitle" className="text-[24px]">
        Игроки
      </Typography>
      <div className="flex flex-col gap-y-2 w-full h-full">
        {users.map((user) => (
          <SearchPageUser key={user.nickname} {...user} />
        ))}
      </div>
    </div>
  );
};
