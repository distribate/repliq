"use client";

import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadCommentItem } from "../../thread-comment/components/thread-comment-item.tsx";
import { threadCommentsQuery } from "../queries/thread-comments-query.ts";
import { ThreadCommentEntity } from "@repo/types/entities/entities-type.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

type ThreadCommentsProps = Pick<ThreadCommentEntity, "thread_id"> & {
  threadAuthorNickname: string;
  isComments: boolean;
};

type ThreadCommentsHeaderProps = {
  nonComments: boolean;
};

const ThreadCommentsHeader = ({ nonComments }: ThreadCommentsHeaderProps) => {
  return (
    <div className="flex w-fit bg-shark-800 rounded-md px-2 py-0.5">
      {nonComments ? (
        <Typography
          textSize="medium"
          textColor="shark_white"
          className="font-semibold"
        >
          Комментариев еще нет...
        </Typography>
      ) : (
        <Typography
          textSize="medium"
          textColor="shark_white"
          className="font-semibold"
        >
          Обсуждение началось
        </Typography>
      )}
    </div>
  );
};

export const ThreadCommentsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2 items-center w-full">
      <Skeleton className="h-8 w-44" />
      <div className="flex flex-col items-start gap-y-2 w-full">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    </div>
  );
};

export const ThreadComments = ({
  thread_id,
  threadAuthorNickname,
  isComments,
}: ThreadCommentsProps) => {
  const { inView, ref } = useInView({
    threshold: 0,
  });

  const { data: threadComments, isLoading } = threadCommentsQuery({
    thread_id,
    isComments,
  });

  useEffect(() => {
    if (inView) {
    }
  }, []);

  if (isLoading) return <ThreadCommentsSkeleton />;

  const nonComments = isComments && !threadComments;

  return (
    <div className="flex flex-col items-center w-full">
      <ThreadCommentsHeader nonComments={nonComments} />
      {threadComments && (
        <div className="flex flex-col items-start gap-y-2 w-full">
          {threadComments.map((comment, i) => (
            <ThreadCommentItem
              key={i}
              thread_id={thread_id}
              id={comment.id}
              replied={comment.replied}
              edited={comment.edited}
              content={comment.content}
              nickname={comment.user_nickname}
              isAuthor={comment.user_nickname === threadAuthorNickname}
              created_at={comment.created_at}
            />
          ))}
          <div ref={ref} className="h-[1px] w-full border" />
        </div>
      )}
    </div>
  );
};
