import { useState } from "react";
import { postViewsAction, postViewsDataAtom, postViewsMetaAtom } from "#components/post/post-item/models/post-views.model";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { UserNickname } from "#components/user/components/name/nickname";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { PostFooterViews } from "#components/post/post-item/components/post-footer-views.tsx";
import { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#lib/create-link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@repo/ui/src/components/hover-card";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@repo/ui/src/components/sheet";
import { IconX } from "@tabler/icons-react";
import { Separator } from "@repo/ui/src/components/separator";
import { atom, AtomState } from "@reatom/core";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { UserDonate } from "#components/user/components/donate/components/donate";
import dayjs from "@repo/shared/constants/dayjs-instance.ts";

type PostViewsBase = {
  id: string
  enabled: boolean;
};

type PostFooterWithViewsListProps = Pick<PostViewsBase, "id"> & Pick<UserPostItem, "views_count">;

const PostFooterViewsListSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
};

type PostViewCardProps = NonNullable<AtomState<typeof postViewsDataAtom>>[number] & {
  expanded?: boolean
}

const PostViewCard = ({
  nickname, created_at, avatar, is_donate, expanded = false
}: PostViewCardProps) => {
  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <div className="flex items-center gap-2 min-w-1/2 justify-between">
        <div className="flex items-center gap-1 min-w-0">
          <CustomLink
            to={createIdLink("user", nickname)}
            className="h-8 aspect-square min-h-8 max-h-8"
          >
            <Avatar
              url={avatar}
              className="h-8 aspect-square min-h-8 max-h-8"
              propWidth={32}
              propHeight={32}
              nickname={nickname}
            />
          </CustomLink>
          <div className="flex items-center gap-1 min-w-0 overflow-hidden">
            <CustomLink to={createIdLink("user", nickname)} className="truncate max-w-full block">
              <UserNickname nickname={nickname} className="truncate text-base" />
            </CustomLink>
            {is_donate && <UserDonate />}
          </div>
        </div>
      </div>
      {expanded && (
        <Typography className="text-shark-300 text-sm text-nowrap">
          {dayjs(created_at).fromNow()}
        </Typography>
      )}
    </div>
  );
};

const Sync = ({ target, enabled }: { target: string, enabled: boolean }) => {
  useUpdate((ctx) => {
    if (!enabled) return;

    postViewsAction(ctx, target)
  }, [target, enabled])

  return null;
}

const viewsExpandedSheetIsOpenAtom = atom(false, "viewsExpandedSheetIsOpen")

const ViewsNotFound = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full p-1">
      <Typography textSize="small" textColor="gray">
        Пока никто не просмотрел этот пост
      </Typography>
    </div>
  )
}

const ViewsExpandedList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(postViewsDataAtom);

  if (!data) {
    return null
  }

  return (
    <Sheet open={ctx.spy(viewsExpandedSheetIsOpenAtom)} onOpenChange={v => viewsExpandedSheetIsOpenAtom(ctx, v)}>
      <SheetContent side="right" className="flex flex-col gap-4 p-4 rounded-lg overflow-y-auto h-full">
        <SheetTitle className="hidden">Просмотрено</SheetTitle>
        <div className="flex items-center gap-2">
          <SheetClose>
            <IconX size={28} />
          </SheetClose>
          <Typography className="font-semibold leading-5 text-xl">
            Просмотревшие
          </Typography>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 w-full h-full p-2">
          {data.map(user => <PostViewCard key={user.nickname} {...user} expanded={true} />)}
        </div>
      </SheetContent>
    </Sheet>
  )
}, "ViewsExpandedList")

const ViewsList = reatomComponent<Pick<UserPostItem, "views_count"> & { expanded?: boolean }>(({
  ctx, views_count, expanded = false
}) => {
  const data = ctx.spy(postViewsDataAtom);
  const meta = ctx.spy(postViewsMetaAtom)
  const isLoading = ctx.spy(postViewsAction.statusesAtom).isPending

  if (!views_count) {
    return <ViewsNotFound />
  }

  if (!data || !meta) return null;

  return (
    <>
      {isLoading ? <PostFooterViewsListSkeleton /> : (
        <div className="flex flex-col gap-3 w-full p-1">
          <Typography textSize="small" className="text-shark-300">
            Просмотрено
          </Typography>
          <div className="flex flex-col gap-2">
            {data.slice(0, 3).map(user => <PostViewCard key={user.nickname} {...user} expanded={expanded} />)}
            {meta.count > 3 && (
              <span
                className="text-shark-300 text-sm cursor-pointer"
                onClick={() => viewsExpandedSheetIsOpenAtom(ctx, true)}
              >
                показать больше
              </span>
            )}
          </div>
        </div>
      )}
    </>
  )
}, "ViewsList")

const PostViewsMobileView = ({ id, views_count }: PostFooterWithViewsListProps) => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <Sheet open={enabled} onOpenChange={setEnabled}>
      <SheetTrigger>
        <PostFooterViews views_count={views_count} />
      </SheetTrigger>
      <SheetContent
        className="flex flex-col gap-4 max-h-2/3 overflow-y-auto min-h-24 rounded-t-lg p-4"
        side="bottom"
        withClose={false}
      >
        <SheetTitle className="hidden">Просмотрено</SheetTitle>
        <div className="flex items-center gap-2 ">
          <SheetClose>
            <IconX size={28} />
          </SheetClose>
          <Typography className="font-semibold leading-5 text-xl">
            Просмотрено
          </Typography>
        </div>
        <Separator />
        <div className="flex w-full h-full">
          <Sync target={id} enabled={enabled && views_count > 0} />
          <ViewsList views_count={views_count} expanded={true} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

const PostViewsDesktopView = ({ id, views_count }: PostFooterWithViewsListProps) => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <HoverCard openDelay={1}>
      <HoverCardTrigger>
        <div onMouseEnter={() => setEnabled(true)}>
          <PostFooterViews views_count={views_count} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <Sync target={id} enabled={enabled && views_count > 0} />
        {enabled && (
          <ViewsList views_count={views_count} />
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

export const PostFooterWithViewsList = ({ id, views_count }: PostFooterWithViewsListProps) => {
  return (
    <>
      <div className="sm:hidden block">
        <PostViewsMobileView id={id} views_count={views_count} />
      </div>
      <div className="sm:block hidden">
        <PostViewsDesktopView id={id} views_count={views_count} />
        <ViewsExpandedList />
      </div>
    </>
  );
};