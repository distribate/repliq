import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { CustomLink } from "#components/shared/link";
import { Text } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";
import { processSelectEntryAction } from "../models/search-page.model";
import { reatomComponent } from "@reatom/npm-react";
import { SearchThread, SearchUser } from "../models/search.model";
import { createIdLink } from "@repo/lib/utils/create-link"

export const SearchPageThread = reatomComponent<SearchThread>(({ ctx, title, id }) => {
  return (
    <CustomLink
      to={createIdLink("thread", id)}
      onClick={() => processSelectEntryAction(ctx, { title, id })}
      className="flex p-4 items-center gap-2 bg-shark-700/40 truncate w-full rounded-md"
    >
      <Text size={46} className="text-shark-300" />
      <Typography className="text-[18px]">
        {title}
      </Typography>
    </CustomLink>
  );
}, "SearchPageThread")

export const SearchPageUser = reatomComponent<SearchUser>(({ ctx, avatar, nickname, name_color }) => {
  return (
    <CustomLink
      to={createIdLink("user", nickname)}
      onClick={() => processSelectEntryAction(ctx, { nickname, avatar, name_color })}
      className="flex p-2 items-center gap-2 bg-shark-700/40 w-full rounded-md"
    >
      <div className="flex items-center justify-center size-8 md:size-16">
        <Avatar url={avatar} rounded="default" nickname={nickname} propWidth={40} propHeight={40} />
      </div>
      <UserNickname nickname={nickname} nicknameColor={name_color} className="text-[18px]" />
    </CustomLink>
  );
}, "SearchPageUser")