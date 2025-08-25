import { ThreadCommentItem } from '../../thread-comment/components/thread-comment-item.tsx';
import { resetThreadComments, threadCommentsAction, threadCommentsDataAtom } from '../models/thread-comments.model.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { useInView } from 'react-intersection-observer';
import { isExistAtom, isViewAtom, updateCommentsAction } from '../models/update-comments.model.ts';
import { SectionSkeleton } from '#components/templates/components/section-skeleton.tsx';
import { reatomComponent, useUpdate } from '@reatom/npm-react';
import { onConnect, onDisconnect } from '@reatom/framework';
import { threadAtom, threadOwnerAtom, threadParamAtom, threadPropertiesAtom } from '#components/thread/models/thread.model.ts';
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model.ts';
import { ThreadCommentsHeader } from './thread-comments-header.tsx';
import { ThreadCommentsAnchor } from './thread-comments-anchor.tsx';
import { CreateThreadComment } from '#components/thread/create-thread-comment/components/create-thread-comment.tsx';
import { isAuthenticatedAtom } from '#components/auth/models/auth.model.ts';
import { AuthorizeTemplate } from '#components/templates/components/auth-template.tsx';
import { CommentsDisabled } from './comments-disabled.tsx';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@repo/ui/src/components/sheet.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';

const ThreadCommentsSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
    </div>
  )
}

const UpdatedSkeleton = reatomComponent(({ ctx }) => {
  if (!ctx.spy(updateCommentsAction.statusesAtom).isPending) return null;

  return <ThreadCommentsSkeleton />
}, "UpdatedSkeleton")

const Viewer = reatomComponent(({ ctx }) => {
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  useUpdate((ctx) => isViewAtom(ctx, inView), [inView])

  const isExist = ctx.spy(isExistAtom)
  if (!isExist) return null;

  return <div ref={ref} className="h-[1px] w-full" />
}, "Viewer")

const List = reatomComponent(({ ctx }) => {
  if (ctx.spy(threadCommentsAction.statusesAtom).isPending) {
    return <SectionSkeleton />;
  }

  const threadId = ctx.spy(threadParamAtom)
  const threadOwner = ctx.spy(threadOwnerAtom)
  if (!threadId || !threadOwner) return null;

  const data = ctx.spy(threadCommentsDataAtom)
  if (!data) return null;

  return (
    <>
      {data.map((comment, idx) => (
        <ThreadCommentItem
          key={comment.id}
          idx={idx + 1}
          threadId={threadId}
          id={comment.id}
          replied={comment.replied}
          is_updated={comment.is_updated}
          user={comment.user}
          content={comment.content}
          isOwner={comment.user.nickname === threadOwner.nickname}
          created_at={comment.created_at}
          updated_at={comment.updated_at}
        />
      ))}
      <UpdatedSkeleton />
    </>
  )
}, "List")

const ANCHOR_MIN_COMMENTS_LENGTH = 8

onConnect(threadCommentsDataAtom, threadCommentsAction)
onDisconnect(threadCommentsDataAtom, (ctx) => resetThreadComments(ctx))

const ThreadCommentsHeaderSection = reatomComponent(({ ctx }) => {
  const properties = ctx.spy(threadPropertiesAtom)
  if (!properties) return null;

  const { is_comments: isCommentsEnabled } = properties

  return (
    isCommentsEnabled ? (
      <ThreadCommentsHeader non_comments={!isCommentsEnabled} />
    ) : (
      <CommentsDisabled />
    )
  )
}, "ThreadCommentsHeaderSection")

const ThreadCommentsContent = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  const threadOwner = ctx.spy(threadOwnerAtom)
  const properties = ctx.spy(threadPropertiesAtom)

  if (!thread || !threadOwner || !properties) return null;

  // const showAnchor = thread.comments_count >= ANCHOR_MIN_COMMENTS_LENGTH

  return (
    <>
      <div className="flex flex-col items-center relative w-full">
        <div className="flex flex-col items-start gap-y-2 w-full">
          <List />
          <Viewer />
        </div>
      </div>
    </>
  )
}, "ThreadCommentsContent")

export const ThreadCommentsSection = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  if (!isAuthenticated) {
    const templateTitle = "Для просмотра комментариев необходимо авторизоваться."
    return <AuthorizeTemplate title={templateTitle} />
  }

  const canCreateComment = ctx.spy(userGlobalOptionsAtom).can_create_comments;

  return (
    <>
      <div className="sm:hidden block w-full">
        <Sheet>
          <SheetTrigger className="bg-shark-900/40 w-full rounded-xl px-4 py-2">
            <Typography className="text-lg text-nowrap font-semibold">
              Открыть комментарии
            </Typography>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-4/5 bg-shark-950 overflow-y-auto overflow-x-hidden rounded-t-lg min-h-28 pt-2 px-2"
          >
            <SheetTitle className="hidden">Комментарии</SheetTitle>
            <div className="flex flex-col relative gap-4 w-full h-full">
              <Typography className="text-2xl font-semibold">
                Комментарии
              </Typography>
              <ThreadCommentsHeaderSection />
              <ThreadCommentsContent />
              {canCreateComment && (
                <div className="sticky bottom-0 bg-shark-950 py-1">
                  <CreateThreadComment />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden sm:flex flex-col bg-shark-900/40 rounded-xl p-1 overflow-hidden max-h-[100vh] w-full">
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          <ThreadCommentsHeaderSection />
          <ThreadCommentsContent />
        </div>
        {canCreateComment && <CreateThreadComment />}
      </div>
    </>
  )
}, "ThreadCommentsSection")