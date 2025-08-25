import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { friendsSearchFilterQueryValueAtom, SEARCH_VALUE_MAX_LENGTH } from "../models/friends-filtering.model";

export const FriendsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  return (
    <Input
      className="rounded-lg"
      value={ctx.spy(friendsSearchFilterQueryValueAtom)}
      maxLength={SEARCH_VALUE_MAX_LENGTH}
      placeholder="Поиск по нику"
      onChange={e => friendsSearchFilterQueryValueAtom(ctx, e.target.value)}
      {...props}
    />
  );
}, "FriendsFilteringSearch")