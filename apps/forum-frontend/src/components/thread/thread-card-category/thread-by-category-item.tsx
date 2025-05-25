import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import {
  MessageSquare,
  MessageSquareOff,
} from "lucide-react";
import type { ThreadPreview } from "@repo/types/entities/thread-type.ts"

export const ThreadByCategoryItem = ({
  created_at, properties, title, comments_count, owner,
}: ThreadPreview) => {
  const createdAt = dayjs(created_at).from(dayjs());

  return (
    <div className="flex grow group bg-shark-900 hover:bg-shark-700 rounded-md justify-between transition-all duration-150 p-3 cursor-pointer">
      <div className="flex flex-col gap-y-2 justify-between w-2/3">
        <div className="flex items-center gap-x-2">
          <Avatar nickname={owner.nickname} propWidth={42} propHeight={36} className="min-h-[42px] min-w-[42px]" />
          <div className="flex flex-col truncate">
            <Typography textColor="shark_white" className="text-[17px] truncate font-medium">
              {title}
            </Typography>
            <Typography className="text-[16px] text-shark-300 truncate font-medium">
              {owner.nickname} создал {createdAt}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2 rounded-md px-2 py-1 aspect-square border-white/10 border-[1px]">
        <div className="flex items-center gap-1 w-full">
          {properties.is_comments ? (
            <>
              <MessageSquare className="text-shark-300" size={16} />
              <Typography className="text-shark-300 text-sm font-normal">
                {comments_count}
              </Typography>
            </>
          ) : (
            <MessageSquareOff className="text-red-500" size={16} />
          )}
        </div>
      </div>
    </div>
  );
};