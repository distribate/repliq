import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Input, InputProps } from "@repo/ui/src/components/input.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
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

export const ProfileFriendsFiltering = reatomComponent(({ ctx }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  if (!nickname) return;

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center w-fit">
        <Typography textColor="shark_white" textSize="big" className="font-semibold">
          Друзья {nickname}
        </Typography>
      </div>
      <div className="flex items-center gap-2 w-fit">
        <ProfileFriendsFilteringSearch />
      </div>
    </div>
  );
}, "ProfileFriendsFiltering")