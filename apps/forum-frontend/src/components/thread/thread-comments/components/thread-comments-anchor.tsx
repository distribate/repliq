import { updateCommentsAction } from "../models/update-comments.model";
import { threadAtom } from "#components/thread/thread-main/models/thread.model";
import { threadCommentsDataAtom, threadCommentsMetaAtom } from "../models/thread-comments.model";
import { ArrowDown } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";

const THREAD_COMMENTS_LENGTH_FOR_PAGE = 16;

export const ThreadCommentsAnchor = reatomComponent(({ ctx }) => {
  const currentThread = ctx.spy(threadAtom)
  const threadComments = ctx.spy(threadCommentsDataAtom)
  const threadCommentsMeta = ctx.spy(threadCommentsMetaAtom)

  if (!currentThread) return null

  const handleScrollToLastComment = async () => {
    const totalCommentsLength = currentThread.comments_count;
    const iter = Math.ceil(totalCommentsLength / THREAD_COMMENTS_LENGTH_FOR_PAGE);

    let updatedCommentsCount = 0;

    const currentThreadCommentsLength = threadComments?.length

    if (totalCommentsLength !== currentThreadCommentsLength) {
      for (let i = 0; i < iter; i++) {
        const cursor = threadCommentsMeta?.endCursor

        if (cursor) {
          updateCommentsAction(ctx, { threadId: currentThread.id, cursor })

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
}, "ThreadCommentsAnchor")