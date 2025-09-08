import {
  categoryThreadsAction,
  categoryThreadsDataAtom,
  isExistAtom,
  resetCategoryThreads,
  CategoryThreadsViewer,
} from "../models/category-threads.model.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { ThreadLayout } from "#components/thread/components/thread-layout/thread-layout.tsx";
import { ThreadNotFound } from "#components/templates/components/threads-not-found.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { cva } from "class-variance-authority";
import { categoryThreadsViewAtom } from "../models/category-filter.model.ts";
import { ContentNotFound } from "#components/templates/components/content-not-found.tsx";
import { onConnect, onDisconnect } from "@reatom/framework";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { MessageSquare, MessageSquareOff } from "lucide-react";
import type { ThreadPreview } from "@repo/types/entities/thread-type.ts"
import dayjs from "@repo/shared/constants/dayjs-instance.ts";

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

const categoryThreadsListLayoutVariants = cva("w-full h-full", {
  variants: {
    variant: {
      grid: "grid lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-2",
      cols: "flex flex-col gap-2"
    }
  },
  defaultVariants: {
    variant: "cols"
  }
})

const CategoryThreadsSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {Array.from({ length: 10 }).map((_, idx) => <Skeleton key={idx} className="h-16 w-full" />)}
    </div>
  );
};

const CategoryThreadsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(categoryThreadsDataAtom)
  const isExist = ctx.spy(isExistAtom)

  if (ctx.spy(categoryThreadsAction.statusesAtom).isPending) {
    return <CategoryThreadsSkeleton />
  }

  if (ctx.spy(categoryThreadsAction.statusesAtom).isRejected) {
    return <ThreadNotFound />
  }

  if (!data || !isExist) {
    return <ContentNotFound title="Тредов еще нет" />
  }

  const variant = ctx.spy(categoryThreadsViewAtom)

  return (
    <div className={categoryThreadsListLayoutVariants({ variant })}>
      {data.map((thread) => (
        <ThreadLayout
          key={thread.id}
          id={thread.id}
          title={thread.title}
          owner={{
            nickname: thread.nickname,
            name_color: thread.name_color,
            avatar: thread.avatar
          }}
        >
          <ThreadByCategoryItem
            title={thread.title}
            id={thread.id}
            owner={{
              nickname: thread.nickname,
              name_color: thread.name_color,
              avatar: thread.avatar
            }}
            created_at={thread.created_at}
            comments_count={thread.comments_count}
            views_count={thread.views_count}
            properties={{
              is_comments: thread.is_comments
            }}
            description={thread.description}
          />
        </ThreadLayout>
      ))}
    </div>
  )
}, "CategoryThreadsList")

onConnect(categoryThreadsDataAtom, categoryThreadsAction)
onDisconnect(categoryThreadsDataAtom, resetCategoryThreads)

export const CategoryThreads = () => {
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <CategoryThreadsList />
        <CategoryThreadsViewer />
      </div>
    </>
  );
}