import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import dayjs from "@repo/shared/constants/dayjs-instance.ts";
import { MessageSquare, MessageSquareOff } from "lucide-react";
import type { ThreadPreview } from "@repo/types/entities/thread-type.ts"

export const ThreadByCategoryItem = ({
  created_at, properties, title, comments_count, owner: { nickname, avatar },
}: ThreadPreview) => {
  return (
    <div className="flex grow group bg-shark-900/40 hover:bg-shark-900 rounded-lg justify-between duration-150 p-3">
      <div className="flex flex-col gap-2 justify-between w-2/3">
        <div className="flex items-center gap-2">
          <Avatar
            url={avatar}
            nickname={nickname}
            propWidth={42}
            propHeight={42}
            className="min-h-10 aspect-square h-10 max-h-10"
          />
          <div className="flex flex-col truncate">
            <Typography textColor="shark_white" className="text-lg truncate">
              {title}
            </Typography>
            <Typography className="text-base text-shark-300 truncate">
              {nickname} создал {dayjs(created_at).from(dayjs())}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 aspect-square">
        <div className="flex items-center gap-1 w-full">
          {properties.is_comments ? (
            <>
              <Typography className="text-shark-300 text-sm font-normal">
                {comments_count}
              </Typography>
              <MessageSquare className="text-shark-300" size={16} />
            </>
          ) : (
            <MessageSquareOff className="text-red-500" size={16} />
          )}
        </div>
      </div>
    </div>
  );
};