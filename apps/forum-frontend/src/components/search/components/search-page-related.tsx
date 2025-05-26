import { Typography } from "@repo/ui/src/components/typography.tsx";
import { searchTypeParamAtom, threadRelatedAction, usersRelatedAction } from "#components/search/models/search-related.model";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { THREAD_URL, USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button";
import { SearchThreadsCategories } from "./search-threads-categories";

const SearchPageRelatedSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
      <Skeleton className="w-full h-[280px]" />
      <Skeleton className="w-full h-[280px]" />
      <Skeleton className="w-full h-[280px]" />
      <Skeleton className="w-full h-[280px]" />
      <Skeleton className="w-full h-[280px]" />
    </div>
  );
};

const RelatedUser = ({ nickname }: { nickname: string }) => {
  return (
    <div className="flex flex-col group gap-2 overflow-hidden justify-between items-center lg:h-[280px] friend-card">
      <CustomLink to={USER_URL + nickname} className="size-16 md:size-20 lg:size-[128px]">
        <Avatar nickname={nickname} propWidth={128} propHeight={128} />
      </CustomLink>
      <div className="flex flex-col items-start gap-1 w-full justify-start">
        <CustomLink to={USER_URL + nickname}>
          <UserNickname nickname={nickname} className="truncate" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-center gap-2 *:w-full w-full">
        <FriendButton recipient={nickname} />
      </div>
    </div>
  )
}

const RelatedThread = ({ id, title, description }: { id: string, title: string, description: string | null }) => {
  return (
    <div className="flex flex-col group gap-2 justify-between overflow-hidden items-start h-[200px] friend-card">
      <Typography className="text-[18px]">{title}</Typography>
      {description && (
        <div className="w-full h-[40px] whitespace-pre">
          <Typography className="text-[16px] truncate" textColor="gray">
            {description}
          </Typography>
        </div>
      )}
      <CustomLink to={THREAD_URL + id} className="flex items-center w-full">
        <Button state="default" className="px-6 w-full">
          <Typography>Перейти к треду</Typography>
        </Button>
      </CustomLink>
    </div>
  )
}

export const SearchRelatedUsers = reatomComponent(({ ctx }) => {
  if (ctx.spy(usersRelatedAction.statusesAtom).isPending) {
    return <SearchPageRelatedSkeleton />;
  }

  const relatedState = ctx.spy(usersRelatedAction.dataAtom)
  if (!relatedState) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
      {relatedState.map(({ nickname }) => (
        <RelatedUser key={nickname} nickname={nickname} />
      ))}
    </div>
  )
}, "SearchRelatedUsers")

export const SearchRelatedThreads = reatomComponent(({ ctx }) => {
  if (ctx.spy(threadRelatedAction.statusesAtom).isPending) {
    return <SearchPageRelatedSkeleton />;
  }

  const relatedState = ctx.spy(threadRelatedAction.dataAtom)
  if (!relatedState) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
      {relatedState.map(({ id, title, description }) => (
        <RelatedThread key={id} id={id} title={title} description={description} />
      ))}
    </div>
  )
}, "SearchRelatedThreads")

export const SearchPageRelated = reatomComponent(({ ctx }) => {
  return (
    <>
      {ctx.spy(searchTypeParamAtom) === 'threads' && <SearchThreadsCategories />}
      <div className="flex flex-col gap-y-8 w-full h-full">
        {ctx.spy(searchTypeParamAtom) === 'users' && (
          <div className="flex flex-col gap-y-4 w-full h-full">
            <Typography className="font-semibold" textSize="very_big">
              Последние зарегистрированные игроки
            </Typography>
            <SearchRelatedUsers />
          </div>
        )}
        {ctx.spy(searchTypeParamAtom) === 'threads' && (
          <div className="flex flex-col gap-y-4 w-full h-full">
            <Typography className="font-semibold" textSize="very_big">
              Последние треды
            </Typography>
            <SearchRelatedThreads />
          </div>
        )}
      </div>
    </>
  )
})