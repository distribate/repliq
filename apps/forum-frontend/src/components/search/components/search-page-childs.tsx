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

export const SearchPageUser = reatomComponent<SearchUser>(({ ctx, avatar, nickname, description, name_color }) => {
  return (
    <CustomLink
      to={createIdLink("user", nickname)}
      onClick={() => processSelectEntryAction(ctx, { description, nickname, avatar, name_color })}
      className="flex items-center p-2 gap-3 bg-shark-900/60 w-full rounded-lg"
    >
      <div className="flex items-center justify-center">
        <Avatar
          className="min-w-[56px] min-h-[56px]"
          url={avatar}
          rounded="default"
          nickname={nickname}
          propWidth={56}
          propHeight={56}
        />
      </div>
      <div className="flex flex-col">
        <UserNickname nickname={nickname} nicknameColor={name_color} className="text-lg" />
        {description && (
          <Typography>
            {description}
          </Typography>
        )}
      </div>
    </CustomLink>
  );
}, "SearchPageUser")