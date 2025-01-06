import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadOwner } from "@repo/types/entities/thread-type";

type ThreadCreatorProps = ThreadOwner

export const ThreadCreator = ({ name_color, nickname }: ThreadCreatorProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <Link href={USER_URL + nickname}>
        <Avatar nickname={nickname} propWidth={36} propHeight={36} />
      </Link>
      <div className="flex flex-col w-fit">
        <Link href={USER_URL + nickname}>
          <UserNickname nickname={nickname} />
        </Link>
        {/* <Typography textSize="small" textColor="gray">
          {threadsCount}&nbsp;
          {threadsCount >= 2 ? "треда" : "тред"}
        </Typography> */}
      </div>
    </div>
  );
};
