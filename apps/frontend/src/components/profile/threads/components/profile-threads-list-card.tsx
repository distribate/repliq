import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ArrowRight, BookOpen, MessageSquare, MessagesSquare, Text } from "lucide-react";
import { profileThreadsViewAtom, } from "#components/profile/threads/models/profile-threads-settings.model";
import { Button } from "@repo/ui/src/components/button";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#shared/helpers/create-link";
import dayjs from "@repo/shared/constants/dayjs-instance.ts";
import { IconBrandThreads } from "@tabler/icons-react";

type ThreadCardProps = {
  id: string;
  title: string;
  created_at: string;
  comments_count: number;
}

export const ProfileThreadsListCard = reatomComponent<ThreadCardProps>(({
  id, title, comments_count, created_at, ctx
}) => {
  const view = ctx.spy(profileThreadsViewAtom)

  return (
    <div
      className="flex flex-col lg:flex-row items-start lg:items-center justify-between 
    group bg-shark-950 p-4 lg:p-6 rounded-2xl gap-4 w-full shadow-md transition-all 
    hover:shadow-lg hover:bg-shark-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 invert right-0 w-1/3 h-full opacity-10"
          style={{
            backgroundImage: "url(/images/grid.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        />
      </div>
      <div className="flex flex-col relative z-10 gap-3 w-full min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <IconBrandThreads size={22} className="text-shark-300 shrink-0" />
          <Typography
            textColor="shark_white"
            className="font-semibold text-[22px] truncate group-hover:text-shark-50 transition-colors"
          >
            {title}
          </Typography>
        </div>
        <div className="flex items-center gap-4 text-sm min-w-0 truncate">
          <div className="flex items-center gap-1 text-shark-300 shrink-0">
            <MessagesSquare size={16} />
            <Typography className="text-[16px]" textColor="shark_white">
              {comments_count}
            </Typography>
          </div>
          <div className="h-4 w-px bg-shark-700 shrink-0" />
          <Typography
            title={dayjs(created_at).format("LL")}
            textSize="small"
            textColor="gray"
            className="truncate"
          >
            {dayjs(created_at).fromNow()}
          </Typography>
        </div>
      </div>
      <CustomLink to={createIdLink("thread", id)} className="relative z-10">
        <Button
          state="default"
          className="px-4 lg:px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Typography className="text-[16px] font-medium">
            Перейти к треду
          </Typography>
          <ArrowRight size={16} className="text-shark-300" />
        </Button>
      </CustomLink>
    </div>
  )
}, "ProfileThreadsListCard")