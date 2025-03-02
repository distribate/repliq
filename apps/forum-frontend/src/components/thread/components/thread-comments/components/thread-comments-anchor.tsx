import { useQueryClient } from "@tanstack/react-query";
import { useUpdateComments } from "../hooks/use-update-comments";
import { THREAD_QUERY_KEY } from "#components/thread/components/thread-main/queries/thread-query.ts";
import { ThreadDetailed } from "@repo/types/entities/thread-type";
import { GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types";
import { THREAD_COMMENTS_QUERY_KEY } from "../queries/thread-comments-query";
import { ArrowDown } from "lucide-react";

const THREAD_COMMENTS_LENGTH_FOR_PAGE = 16;

export const ThreadCommentsAnchor = ({
  threadId
}: {
  threadId: string
}) => {
  const qc = useQueryClient();
  const currentThread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId));
  const { updateCommentsMutation } = useUpdateComments()

  if (!currentThread) return null

  const handleScrollToLastComment = async () => {
    const totalCommentsLength = currentThread.comments_count;
    const iter = Math.ceil(totalCommentsLength / THREAD_COMMENTS_LENGTH_FOR_PAGE);

    let updatedCommentsCount = 0;

    const threadComments = qc.getQueryData<GetThreadCommentsResponse>(
      THREAD_COMMENTS_QUERY_KEY(threadId)
    )

    const currentThreadCommentsLength = threadComments?.data.length

    if (totalCommentsLength !== currentThreadCommentsLength) {
      for (let i = 0; i < iter; i++) {
        const threadComments = qc.getQueryData<GetThreadCommentsResponse>(
          THREAD_COMMENTS_QUERY_KEY(threadId)
        )

        const cursor = threadComments?.meta.endCursor

        if (cursor) {
          await updateCommentsMutation.mutateAsync({
            threadId, cursor,
          });
          
          updatedCommentsCount += THREAD_COMMENTS_LENGTH_FOR_PAGE;
        } else {
          break;
        }
      }
    }

    if (updatedCommentsCount >= totalCommentsLength) {
      const lastCommentId = totalCommentsLength.toString();
      const lastCommentElement = document.getElementById(lastCommentId);

      if (lastCommentElement) {
        lastCommentElement.scrollIntoView({
          behavior: 'smooth', block: 'start',
        });
      } else {
        console.log(null);
      }
    }
  }

  const nonComments = !currentThread.properties.is_comments;

  return (
    !nonComments && (
      <div onClick={handleScrollToLastComment} className="fixed bottom-8 right-8 flex items-center flex-col gap-2">
        {/* todo: implemented calc not viewed comments */}
        {/* <div className="flex items-center justify-center w-8 h-8 bg-shark-500 rounded-[999px]">
          <Typography className="font-semibold">
            {threadComments?.length ?? 0}
          </Typography>
        </div> */}
        <div className="w-12 h-12 rounded-[999px] cursor-pointer hover:bg-shark-700 bg-shark-800 flex items-center justify-center">
          <ArrowDown size={20} className='text-shark-50' />
        </div>
      </div>
    )
  )
}