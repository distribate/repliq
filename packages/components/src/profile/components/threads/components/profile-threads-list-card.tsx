import { UserThreads } from "#profile/components/threads/queries/get-threads-user.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { MessageSquare, Text } from "lucide-react";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { profileThreadsSettingsQuery } from "#profile/components/threads/queries/profile-threads-settings-query.ts";
import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/src/components/button";

interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    created_at: string;
    comments_count: number;
  }
}

export const ProfileThreadsListCard = ({ thread }: ThreadCardProps) => {
  const { data: profileThreadsViewState } = profileThreadsSettingsQuery();
  const { viewType } = profileThreadsViewState;

  const { id, title, created_at, comments_count } = thread;
  const isGrid = viewType === "grid";

  return (
    <div
      className={`${isGrid ? "flex-col" : ""} flex items-center justify-between bg-shark-950 p-2 lg:p-4 rounded-lg gap-4 w-full`}
    >
      <div className={`${isGrid ? "w-full" : "w-1/2 lg:w-2/3"} flex flex-col gap-2`}>
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
                {comments_count}
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
        to={THREAD_URL + id}
        className={`w-full justify-end flex items-center h-full`}
      >
        <Button state="default" className="px-2 hover:bg-shark-700 lg:px-6 py-2">
          <Typography className="text-[18px]">
            Перейти к треду
          </Typography>
        </Button>
      </Link>
    </div>
  )
};