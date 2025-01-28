import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { UserRealName } from "#user/components/real-name/real-name.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { REQUESTED_USER_QUERY_KEY } from "#profile/components/cover/queries/requested-user-query.ts";
import {
  COVER_QUERY_KEY,
  CoverQuery,
} from "#profile/components/cover/queries/cover-query.ts";
import { UserDetailed } from "@repo/types/entities/user-type";

type UserCoverInfoProps = {
  nickname: string;
};

export const UserCoverMainInfo = ({ nickname }: UserCoverInfoProps) => {
  const qc = useQueryClient();
  const requestedUser = qc.getQueryData<UserDetailed>(REQUESTED_USER_QUERY_KEY(nickname));
  
  const coverState = qc.getQueryData<CoverQuery>(COVER_QUERY_KEY);

  if (!requestedUser || !coverState) return;

  const { description, real_name, name_color, donate, favorite_item } = requestedUser;

  return (
    <div className="flex flex-col self-end justify-between h-1/2 gap-y-1">
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <UserNickname
            nickname={nickname}
            nicknameColor={name_color}
            className={coverState.inView ? "text-3xl" : "text-xl"}
          />
          <UserDonate donate={donate} favoriteItemId={favorite_item} />
        </div>
        {real_name && <UserRealName real_name={real_name} />}
      </div>
      {description && (
        <div className="flex">
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
