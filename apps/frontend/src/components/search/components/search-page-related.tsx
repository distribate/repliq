import { Typography } from "@repo/ui/src/components/typography.tsx";
import { threadRelatedAction, usersRelatedAction } from "#components/search/models/search-related.model";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { UserNickname } from "#components/user/components/name/nickname";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#shared/components/link";
import { FriendButton } from "#components/friend/components/friend-button";
import { SearchThreadsCategories } from "./search-threads-categories";
import { createIdLink } from "#shared/helpers/create-link";
import { searchPageTypeAtom } from "../models/search-page.model";
import { cva } from "class-variance-authority";
import { UserDonate } from "#components/user/components/donate/components/donate";
import { AtomState } from "@reatom/core";
import { IconPhoto } from "@tabler/icons-react";
import dayjs from "@repo/shared/constants/dayjs-instance";

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

const userAvatarVariant = cva(`
  min-h-[84px] max-h-[84px] h-[84px]
  md:min-h-[96px] md:h-[96px] md:max-h-[96px]
  lg:min-h-[128px] lg:h-[128px] lg:max-h-[128px]
`)

type RelatedUser = NonNullable<AtomState<typeof usersRelatedAction.dataAtom>>[number]

const RelatedUser = ({ nickname, avatar, description, is_donate, name_color, created_at }: RelatedUser) => {
  return (
    <div className="flex flex-col gap-2 overflow-hidden justify-between items-center bg-shark-900/40 rounded-lg p-2 sm:p-4">
      <CustomLink
        to={createIdLink("user", nickname)}
        className={userAvatarVariant({ className: "overflow-hidden aspect-square" })}
      >
        <Avatar
          url={avatar}
          nickname={nickname}
          propWidth={128}
          propHeight={128}
          className={userAvatarVariant({ className: "aspect-square" })}
        />
      </CustomLink>
      <div className="flex flex-col items-center gap-1 w-full justify-center">
        <div className="flex items-center gap-1">
          <CustomLink to={createIdLink("user", nickname)}>
            <UserNickname nickname={nickname} className="truncate text-lg" nicknameColor={name_color} />
          </CustomLink>
          {is_donate && <UserDonate />}
        </div>
        {description && <span className="truncate w-full text-nowrap">{description}</span>}
        <span className="text-shark-300 text-xs">
          {dayjs(created_at).fromNow()}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 *:w-full w-full">
        <FriendButton recipient={nickname} />
      </div>
    </div>
  )
}

type RelatedThread = NonNullable<AtomState<typeof threadRelatedAction.dataAtom>>[number]

const RelatedThread = ({
  id, title, description, images, created_at, category_id, owner
}: RelatedThread) => {
  return (
    <div className="flex flex-col gap-2 justify-between overflow-hidden items-center bg-shark-900/40 rounded-lg p-2 sm:p-4">
      <Typography className="text-lg font-semibold">
        {title}
      </Typography>
      {description && (
        <div className="w-full h-[40px] whitespace-pre">
          <Typography className="text-base truncate" textColor="gray">
            {description}
          </Typography>
        </div>
      )}
      <div className="flex items-center gap-2 max-h-24 w-full">
        {images.length ? (
          images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full rounded-lg object-cover"
            />
          ))
        ) : (
          <div className=" flex items-center justify-center h-24 w-full rounded-lg bg-shark-700">
            <IconPhoto size={16} className="text-shark-300" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 w-full justify-between">
        <CustomLink
          to={createIdLink("user", owner.nickname)}
          className="flex items-center w-full justify-center rounded-lg h-10 bg-shark-800"
        >
          <UserNickname
            nickname={owner.nickname}
            nicknameColor={owner.name_color}
            className="text-base"
          />
        </CustomLink>
        <CustomLink
          to={createIdLink("thread", id)}
          className="flex items-center w-full"
        >
          <Button className="bg-shark-900 h-10 w-full">
            <Typography className="truncate font-semibold text-shark-50 text-base">
              К треду
            </Typography>
          </Button>
        </CustomLink>
      </div>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 grid-rows-1 gap-4 w-full h-fit">
      {relatedState.map((user) => (
        <RelatedUser key={user.nickname} {...user} />
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
      {relatedState.map((thread) => (
        <RelatedThread key={thread.id} {...thread} />
      ))}
    </div>
  )
}, "SearchRelatedThreads")

export const SearchPageRelated = reatomComponent(({ ctx }) => {
  const type = ctx.spy(searchPageTypeAtom)

  return (
    <>
      {type === 'all' && (
        <>
          <SearchThreadsCategories />
          <div className="flex flex-col gap-y-8 w-full h-full">
            <div className="flex flex-col gap-y-4 w-full h-full">
              <Typography className="font-semibold" textSize="very_big">
                Последние зарегистрированные игроки
              </Typography>
              <SearchRelatedUsers />
            </div>
            <div className="flex flex-col gap-y-4 w-full h-full">
              <Typography className="font-semibold" textSize="very_big">
                Последние треды
              </Typography>
              <SearchRelatedThreads />
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col gap-y-8 w-full h-full">
        {type === 'users' && (
          <div className="flex flex-col gap-y-4 w-full h-full">
            <Typography className="font-semibold" textSize="very_big">
              Последние зарегистрированные игроки
            </Typography>
            <SearchRelatedUsers />
          </div>
        )}
        {type === 'threads' && (
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
}, "SearchPageRelated")