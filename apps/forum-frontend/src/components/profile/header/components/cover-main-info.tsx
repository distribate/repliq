import { UserNickname } from "#components/user/name/nickname";
import { UserDonate } from "#components/user/donate/components/donate.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { coverAtom } from "#components/profile/header/models/cover.model";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { requestedUserAtom } from "#components/profile/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { UserDetailed } from "@repo/types/entities/user-type";
import { UserRealName } from "#components/user/real-name/real-name";

const BirthdayEvent = reatomComponent(({ ctx }) => {
  const requestedUser = ctx.spy(requestedUserAtom) as UserDetailed | null
  if (!requestedUser) return;

  const isBirthday = requestedUser.birthday
    ? dayjs(requestedUser.birthday).format('MM-DD') === dayjs(new Date().toISOString().split('T')[0]).format('MM-DD')
    : false;

  if (!isBirthday) return null;

  return <Typography className="font-[Minecraft] text-xl lg:text-3xl">🎉</Typography>
}, "BirthdayEvent")

export const UserCoverMainInfo = reatomComponent(({ ctx }) => {
  const requestedUser = ctx.spy(requestedUserAtom) as UserDetailed | null
  if (!requestedUser) return;

  const inView = ctx.spy(coverAtom).inView

  const { nickname, description, real_name, name_color, donate } = requestedUser;

  return (
    <div className="flex flex-col lg:items-start items-center self-end justify-between h-1/2 gap-y-1">
      <div className="flex flex-col lg:items-start items-center truncate">
        <div className="flex items-center gap-1">
          <BirthdayEvent />
          <UserNickname nickname={nickname} nicknameColor={name_color} className={inView ? "text-xl lg:text-3xl" : "text-xl"} />
          <UserDonate donate={donate} />
        </div>
        {real_name && <UserRealName real_name={real_name} />}
      </div>
      {description && (
        <div className="hidden lg:flex">
          <Typography textColor="shark_white" className="font-[Minecraft]" textSize="medium">
            {description}
          </Typography>
        </div>
      )}
    </div>
  );
}, "UserCoverMainInfo")