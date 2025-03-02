import { Avatar } from "#components/user/avatar/components/avatar";
import { UserNickname } from "#components/user/name/nickname";
import { getUser } from "@repo/lib/helpers/get-user";
import { userStatusQuery } from "@repo/lib/queries/user-status-query";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { Suspense } from "react";

export const UserPersonalCardHeader = () => {
  const { nickname, name_color } = getUser();
  const { data: userStatus } = userStatusQuery(nickname);

  const isOnline = userStatus?.status;

  return (
    <>
      <Suspense fallback={<Skeleton className="w-[96px] h-[96px]" />}>
        <Avatar propHeight={96} propWidth={96} nickname={nickname} />
      </Suspense>
      <div className="flex flex-col items-center">
        <UserNickname
          nickname={nickname}
          nicknameColor={name_color}
          className="text-base font-bold"
        />
        <Typography>
          {isOnline ? "в сети" : "не в сети"}
        </Typography>
      </div>
    </>
  );
};