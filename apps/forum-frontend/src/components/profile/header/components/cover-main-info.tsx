import { UserNickname } from "#components/user/name/nickname";
import { UserDonate } from "#components/user/donate/components/donate.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { requestedUserAtom } from "#components/profile/main/models/requested-user.model";
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

  return <Typography className="text-xl lg:text-3xl select-none">🎉</Typography>
}, "BirthdayEvent")

export const UserCoverMainInfo = reatomComponent(({ ctx }) => {
  const requestedUser = ctx.spy(requestedUserAtom) as UserDetailed | null
  if (!requestedUser) return;

  return (
    <div className="flex flex-col lg:items-start items-center self-end justify-between h-1/2 gap-y-1">
      <div className="flex flex-col lg:items-start items-center truncate">
        <div className="flex items-center gap-1">
          <BirthdayEvent />
          <UserNickname
            nickname={requestedUser.nickname}
            nicknameColor={requestedUser.name_color}
            className="text-xl lg:text-3xl"
          />
          <UserDonate is_donate={requestedUser.is_donate} />
        </div>
        {requestedUser.real_name && <UserRealName real_name={requestedUser.real_name} />}
      </div>
      {requestedUser.description && (
        <div className="hidden lg:flex">
          <Typography textColor="shark_white" textSize="medium">
            {requestedUser.description}
          </Typography>
        </div>
      )}
    </div>
  );
}, "UserCoverMainInfo")