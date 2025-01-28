import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadCommentActions } from "./thread-comment-actions.tsx";
import { ThreadCommentProps } from "../types/thread-comment-types.ts";
import { useMutationState } from "@tanstack/react-query";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Badge } from "@repo/ui/src/components/badge.tsx";
import { SELECT_COMMENT_MUTATION_KEY } from "../hooks/use-highlight.ts";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { ThreadCommentItemContent } from "#thread/components/thread-comment/components/thread-comment-item-content.tsx";
import { lazy, Suspense } from "react";

const ThreadCommentMoreActions = lazy(() =>
  import("./thread-comment-more-actions.tsx").then(
    (m) => ({ default: m.ThreadCommentMoreActions }),
  ),
);

export const ThreadCommentItem = ({
  user_nickname, is_owner, created_at, content, id, replied, thread_id, is_updated, idx
}: ThreadCommentProps & { idx: number }) => {
  const currentUser = getUser();
  const [active, setActive] = useState<boolean>(false);

  const data = useMutationState({
    filters: { mutationKey: SELECT_COMMENT_MUTATION_KEY(id) },
    select: (m) => m.state.status,
  });

  const mutationStatus = data[data.length - 1];

  useEffect(() => {
    if (mutationStatus === "success") {
      setActive(true);

      const timeoutId = setTimeout(() => setActive(false), 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [mutationStatus]);

  const isCommentOwner = currentUser.nickname === user_nickname;
  const createdAt = dayjs(created_at).fromNow();

  return (
    <div
      id={idx.toString()}
      className={`${active && "animate-flash-fade"}
       flex flex-col h-fit gap-y-4 px-4 py-2 rounded-md bg-shark-950 relative min-w-[450px] w-fit max-w-[80%]`}
    >
      {isCommentOwner && (
        <Suspense>
          <ThreadCommentMoreActions id={id} thread_id={thread_id} />
        </Suspense>
      )}
      <div className="flex items-center gap-2">
        <Link to={USER_URL + user_nickname}>
          <Avatar
            nickname={user_nickname}
            propWidth={42}
            propHeight={42}
            className="min-h-[42px] min-w-[42px]"
          />
        </Link>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <UserNickname nickname={user_nickname} />
              {is_owner && (
                <Badge size="small">
                  <Typography className="font-[Minecraft] leading-4">
                    автор
                  </Typography>
                </Badge>
              )}
            </div>
            <Typography className="text-shark-300 text-sm">
              {createdAt}
            </Typography>
          </div>
        </div>
      </div>
      <ThreadCommentItemContent
        content={content}
        replied={replied}
        isOwner={isCommentOwner}
        id={id}
        thread_id={thread_id}
      />
      <div className="flex items-center justify-between w-full">
        <ThreadCommentActions
          id={thread_id}
          isCommentOwner={isCommentOwner}
          commentId={id}
          commentNickname={user_nickname}
          commentContent={content}
        />
        {is_updated && (
          <Typography textColor="gray" textSize="small">
            [изменено]
          </Typography>
        )}
      </div>
    </div>
  );
};
