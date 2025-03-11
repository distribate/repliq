import { UserNickname } from "#components/user/name/nickname.tsx";
import { UserDonate } from "#components/user/donate/components/donate.tsx";
import { UserRealName } from "#components/user/real-name/real-name.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query.ts";
import {
  COVER_QUERY_KEY,
  CoverQuery,
} from "#components/profile/header/queries/cover-query.ts";
import { UserDetailed } from "@repo/types/entities/user-type";
import dayjs from "@repo/lib/constants/dayjs-instance";

type UserCoverInfoProps = {
  nickname: string;
};

const BirthdayEvent = ({ nickname }: UserCoverInfoProps) => {
  const qc = useQueryClient();
  const requestedUser = qc.getQueryData<UserDetailed>(REQUESTED_USER_QUERY_KEY(nickname));

  if (!requestedUser) return;

  const isBirthday = requestedUser.birthday
    ? dayjs(requestedUser.birthday).format('MM-DD') === dayjs(new Date().toISOString().split('T')[0]).format('MM-DD')
    : false;

  if (!isBirthday) return null;

  return (
    <Typography className="font-[Minecraft] text-xl lg:text-3xl">
      🎉
    </Typography>
  )
}

export const UserCoverMainInfo = ({ nickname }: UserCoverInfoProps) => {
  const qc = useQueryClient();
  const requestedUser = qc.getQueryData<UserDetailed>(REQUESTED_USER_QUERY_KEY(nickname));

  const coverState = qc.getQueryData<CoverQuery>(COVER_QUERY_KEY);

  if (!requestedUser || !coverState) return;

  const { description, real_name, name_color, donate } = requestedUser;

  return (
    <div className="flex flex-col lg:items-start items-center self-end justify-between h-1/2 gap-y-1">
      <div className="flex flex-col lg:items-start items-center truncate">
        <div className="flex items-center gap-1">
          <BirthdayEvent nickname={nickname}/>
          <UserNickname
            nickname={nickname}
            nicknameColor={name_color}
            className={coverState.inView ? "text-xl lg:text-3xl" : "text-xl"}
          />
          <UserDonate donate={donate} />
        </div>
        {real_name && <UserRealName real_name={real_name} />}
      </div>
      {description && (
        <div className="hidden lg:flex">
          <Typography
            textColor="shark_white"
            className="font-[Minecraft]"
            textSize="medium"
          >
            {description}
          </Typography>
        </div>
      )}
    </div>
  );
};
