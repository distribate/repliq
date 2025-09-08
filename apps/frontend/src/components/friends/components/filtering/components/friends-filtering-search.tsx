import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { friendsSearchQueryAtom, SEARCH_VALUE_LENGTH } from "../models/friends-filtering.model";

export const FriendsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  return (
    <Input
      className="rounded-lg"
      value={ctx.spy(friendsSearchQueryAtom)}
      maxLength={SEARCH_VALUE_LENGTH[1]}
      placeholder="Поиск по нику"
      onChange={e => friendsSearchQueryAtom(ctx, e.target.value)}
      {...props}
    />
  );
}, "FriendsFilteringSearch")