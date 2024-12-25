import { Metadata } from "next";
import { getTopicName } from "@repo/lib/queries/get-thread-name.ts";
import { BlockWrapper } from "@repo/components/src/wrappers/block-wrapper.tsx";
import { ThreadControl } from "@repo/components/src/thread/components/thread-control/components/thread-control.tsx";
import { ThreadContent } from "@repo/components/src/thread/components/thread-content/components/thread-content.tsx";
import { ThreadImages } from "@repo/components/src/thread/components/thread-images/thread-images.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getThreadModel } from "@repo/components/src/thread/queries/get-thread-model.ts";
import { ThreadRating } from "@repo/components/src/thread/components/thread-bump/components/thread-rating.tsx";
import { ThreadShare } from "@repo/components/src/thread/components/thread-share/thread-share.tsx";
import { ThreadSave } from "@repo/components/src/thread/components/thread-save/thread-save.tsx";
import { MetadataType, PageConventionProps } from "@repo/types/global";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadMore } from "@repo/components/src/thread/components/thread-more/components/thread-more.tsx";
import { Eye } from "lucide-react";
import { FriendButton } from "@repo/components/src/buttons/friend-button.tsx";
import { Descendant } from "slate";
import { redirect } from "next/navigation";
import { ThreadCreator } from "@repo/components/src/thread/components/thread-creator/components/thread-creator.tsx";
import { Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import dayjsInstance from "@repo/lib/constants/dayjs-instance.ts";
import dynamic from "next/dynamic";
import { ThreadCommentsSkeleton } from "@repo/components/src/thread/components/thread-comments/components/thread-comments.tsx";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export async function generateMetadata({
  params,
}: MetadataType): Promise<Metadata> {
  const { id: thread_id } = params;
  let title: string = "Не найдено";
  if (!thread_id) title = "";
  const data = await getTopicName(thread_id!);
  if (data) title = data.title;
  return { title };
}

const ContentNotFound = dynamic(() =>
  import("@repo/components/src/templates/content-not-found.tsx").then(
    (m) => m.ContentNotFound,
  ),
);

const CommentsDisabled = dynamic(() =>
  import("@repo/components/src/templates/comments-disabled.tsx").then(
    (m) => m.CommentsDisabled,
  ),
);

const CreateThreadComment = dynamic(() =>
  import(
    "@repo/components/src/thread/components/create-thread-comment/components/create-thread-comment.tsx"
  ).then((m) => m.CreateThreadComment),
);

const ThreadComments = dynamic(
  () =>
    import(
      "@repo/components/src/thread/components/thread-comments/components/thread-comments.tsx"
    ).then((m) => m.ThreadComments),
  {
    loading: () => <ThreadCommentsSkeleton />,
  },
);

export default async function TopicsTopicPage({ params }: PageConventionProps) {
  const { id: threadId } = params;
  const { user, session } = await getCurrentSession();
  if (!user || !session || !threadId) return redirect("/");

  const thread = await getThreadModel({ id: threadId, postViews: true });

  if (!thread)
    return <ContentNotFound title="Тред не найден. Возможно он уже удален" />;

  const {
    id,
    title,
    content,
    description,
    owner,
    tags,
    rating,
    isImages,
    isComments,
    isUpdated,
    updated_at,
    created_at,
  } = thread;

  const isThreadCreator = user.nickname === owner.nickname;
  const dateCreated = dayjsInstance(created_at).fromNow();

  return (
    <div className="flex gap-2 items-start h-full w-full relative">
      <div className="flex flex-col min-w-3/4 w-3/4 max-w-3/4 items-start h-full justify-start">
        <div className="flex flex-col gap-6 rounded-lg w-full py-6 bg-primary-color">
          <div className="flex flex-col w-fit px-4">
            <Typography
              textSize="very_big"
              className="font-semibold"
              textColor="shark_white"
            >
              {title}
            </Typography>
            <Typography textColor="gray">
              тема создана{" "}
              <span className="text-caribbean-green-400">{dateCreated}</span> в
              категории ...
            </Typography>
          </div>
          {content && (
            <ThreadContent
              id={id}
              content={content as Descendant[]}
              isOwner={isThreadCreator}
            />
          )}
          {isImages && <ThreadImages id={id} />}
          <div className="flex items-center justify-end w-full gap-3 px-4">
            <div className="flex items-center w-fit gap-1">
              <Eye size={18} className="text-shark-300" />
              <Typography textSize="small" textColor="gray">
                {thread.views}
              </Typography>
            </div>
            {isUpdated && updated_at && (
              <div className="flex items-center w-fit gap-1">
                <Typography textSize="small" textColor="gray">
                  изменено в {thread.updated_at}
                </Typography>
              </div>
            )}
          </div>
        </div>
        <BlockWrapper padding="without" className="mt-4">
          <ThreadMore
            description={description}
            tags={tags}
            created_at={created_at}
            owner={owner}
          />
        </BlockWrapper>
        <div className="flex flex-col w-full h-full mt-2 gap-y-4">
          <ThreadComments
            threadAuthorNickname={owner.nickname}
            thread_id={id}
            isComments={isComments}
          />
          {isComments ? <CreateThreadComment /> : <CommentsDisabled />}
        </div>
      </div>
      <div className="flex flex-col gap-y-4 min-w-1/4 w-1/4 max-w-1/4 h-fit sticky top-0 overflow-hidden">
        <BlockWrapper>
          <div className="flex items-center justify-between w-full">
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <ThreadCreator owner={owner} />
            </Suspense>
            {isThreadCreator ? (
              <Button state="default" className="px-6">
                <Typography>Это вы</Typography>
              </Button>
            ) : (
              <FriendButton requestedUserNickname={owner.nickname} />
            )}
          </div>
        </BlockWrapper>
        <BlockWrapper>
          <div className="flex justify-between items-center w-full">
            <Suspense fallback={<Skeleton className="h-16 w-full" />}>
              {rating && <ThreadRating threadId={id} />}
            </Suspense>
            <div className="flex gap-2 items-center h-full">
              <ThreadShare />
              <ThreadSave />
            </div>
          </div>
        </BlockWrapper>
        {isThreadCreator && <ThreadControl id={id} />}
      </div>
    </div>
  );
}
