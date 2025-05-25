import { Typography } from "@repo/ui/src/components/typography.tsx";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { MessageSquare, Text } from "lucide-react";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { profileThreadsSettingsAtom, } from "#components/profile/threads/models/profile-threads-settings.model";
import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/src/components/button";
import { reatomComponent } from "@reatom/npm-react";

type ThreadCardProps = {
  id: string;
  title: string;
  created_at: string;
  comments_count: number;
}

export const ProfileThreadsListCard = reatomComponent<ThreadCardProps>(({ id, title, comments_count, created_at, ctx }) => {
  const profileThreadsViewState = ctx.spy(profileThreadsSettingsAtom)
  const { viewType } = profileThreadsViewState;
 
  return (
    <div
      data-state={viewType === "grid" ? "grid" : "default"}
      className="flex data-[state=grid]:flex-col items-center group justify-between bg-shark-950 p-2 lg:p-4 rounded-lg gap-4 w-full"
    >
      <div 
        className="flex flex-col gap-2 
          group-data-[state=grid]:w-full group-data-[state=default]:w-1/2 group-data-[state=default]:lg:w-2/3"
      >
        <div className="flex items-center gap-1 w-full relative -left-[2px]">
          <Text size={20} className="text-shark-300" />
          <Typography textColor="shark_white" className="font-medium text-[20px] truncate">
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
}, "ProfileThreadsListCard")