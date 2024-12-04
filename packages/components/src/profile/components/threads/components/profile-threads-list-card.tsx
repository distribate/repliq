import { UserThreads } from "#profile/components/threads/queries/get-threads-user.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import Link from "next/link";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { MessageSquare, Text } from "lucide-react";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { profileThreadsSettingsQuery } from "#profile/components/threads/queries/profile-threads-settings-query.ts";

export const ProfileThreadsListCard = ({
  created_at,
  id,
  title,
  commentsCount,
}: UserThreads) => {
  const { data: profileThreadsViewState } = profileThreadsSettingsQuery();
  const { viewType } = profileThreadsViewState;

  const isGrid = viewType === "grid";

  return (
    <div
      className={`${isGrid ? "flex-col" : ""}
      flex items-center justify-between bg-shark-950 p-4 rounded-lg gap-4 w-full`}
    >
      <div className={`${isGrid ? "w-full" : "w-2/3"} flex flex-col gap-2`}>
        <div className="flex items-center gap-1 w-full relative -left-[2px]">
          <Text size={20} className="text-shark-300" />
          <Typography
            textColor="shark_white"
            className="font-medium text-[20px] truncate"
          >
            {title}
          </Typography>
        </div>
        <div className="flex items-center h-full gap-4 w-full">
          <div className="h-[16px] w-[3px] bg-shark-500" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MessageSquare size={16} className="text-shark-300 font-normal" />
              <Typography className="text-[18px]" textColor="shark_white">
                {commentsCount}
              </Typography>
            </div>
            <Typography
              title={dayjs(created_at).format("LL")}
              textSize="medium"
              textColor="gray"
              className="cursor-default"
            >
              {dayjs(created_at).fromNow()}
            </Typography>
          </div>
        </div>
      </div>
      <Link
        href={THREAD_URL + id}
        className={`${isGrid ? "w-full" : "w-fit"}
         transition-all ease-in duration-150 hover:bg-shark-800 px-6 py-4 h-full rounded-md bg-shark-900`}
      >
        <Typography className="text-[18px]">Перейти к треду</Typography>
      </Link>
    </div>
  );
};
