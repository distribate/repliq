import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { action, sleep, withConcurrency } from "@reatom/framework";
import { profileFriendsSearchQueryAtom, updateProfileFriendsAction } from "../models/profile-friends.model";

const onChange = action(async (ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  await ctx.schedule(() => sleep(300))

  const convertedValue = value.replace(/ {3,}/g, "  ");
  profileFriendsSearchQueryAtom(ctx, convertedValue)

  await ctx.schedule(() => sleep(40))

  updateProfileFriendsAction(ctx, "update-filter")
}).pipe(withConcurrency())

const ProfileFriendsFilteringSearch = reatomComponent<InputProps>(({ ctx, ...props }) => {
  return (
    <Input
      className="rounded-lg"
      maxLength={64}
      placeholder="Поиск по никнейму"
      onChange={e => onChange(ctx, e)}
      {...props}
    />
  );
}, "ProfileFriendsFilteringSearch")

export const ProfileFriendsFiltering = () => {
  return (
    <div className="flex items-center gap-2 w-fit">
      <ProfileFriendsFilteringSearch />
    </div>
  );
}