import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { UserRealName } from "#user/components/real-name/real-name.tsx";
import { UserDonate } from "#user/components/donate/components/donate.tsx";
import { userCardQuery } from "../queries/user-main-card-query.ts";
import Glass from "@repo/assets/images/minecraft/glass.webp";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { UserSummaryCardSkeleton } from "./user-summary-card-skeleton.tsx";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { InferResponseType } from "hono/client";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { FriendButton } from "#buttons/friend-button.tsx";

const UserSummaryCardPrivated = lazy(() =>
  import("./user-summary-card-privated.tsx").then(m => ({ default: m.UserSummaryCardPrivated }))
)

const UserSummaryCardLimited = lazy(() =>
  import("./user-summary-card-limited.tsx").then(m => ({ default: m.UserSummaryCardLimited }))
)

const client = forumUserClient.user["get-user-summary"][":nickname"].$get

type UserDetailedProps = InferResponseType<typeof client, 200>["data"]

const UserDetailed = ({
  ...userData
}: UserDetailedProps) => {
  const currentUser = getUser()
  const { nickname, threads_count, friends_count, real_name, shared_friends, created_at, description, donate } = userData
  const favoriteItem = userData?.favorite_item;

  const joinedAt = dayjs(created_at).format("Присоединился в DD.MM.YYYY");

  return (
    <>
      <div className="flex items-center gap-4 p-4 w-full">
        <div className="flex relative justify-center p-2 items-center">
          <div className="z-1 absolute w-full h-full right-0 left-0 bottom-0 top-0">
            <img
              src={Glass}
              alt=""
              width={104}
              height={104}
            />
          </div>
          <Link to={USER_URL + nickname}>
            <Suspense fallback={<Skeleton className="h-[88px] w-[88px]" />}>
              <Avatar
                nickname={nickname}
                propWidth={88}
                propHeight={88}
                className="z-2 relative !rounded-none"
              />
            </Suspense>
          </Link>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col">
            <Link to={USER_URL + nickname}>
              <UserNickname nickname={nickname} nicknameColor={`#ffffff`} />
            </Link>
            {real_name && <UserRealName real_name={real_name} />}
          </div>
          <div className="w-fit">
            <UserDonate donate={donate} nickname={nickname} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 p-4 items-center w-full bg-shark-950 h-full rounded-t-lg">
        <div className="flex flex-col gap-y-4 items-center w-full">
          {description && (
            <div className="flex flex-col gap-y-1 w-full">
              <Typography>Описание</Typography>
              <div className="flex bg-shark-900 rounded-sm overflow-hidden px-2 py-0.5">
                <Typography className="whitespace-normal" textSize="small">
                  {description}
                </Typography>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-y-1 w-full">
            <Typography className="text-[18px]" textColor="gray">
              Участник Fasberry:
            </Typography>
            <div className="flex items-center gap-2">
              <Typography textSize="small">
                {joinedAt}
              </Typography>
            </div>
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="stats" className="flex flex-col w-full gap-2 items-start">
          <TabsList className="flex w-full min-h-1 items-center justify-start gap-4">
            <TabsTrigger
              value="stats"
              className="duration-300 transition-all ease-in-out 
              data-[state=inactive]:bg-transparent data-[state=active]:bg-transparent 
              data-[state=active]:decoration-2 data-[state=active]:underline data-[state=active]:underline-offset-8 
              data-[state=active]:decoration-shark-50 !p-0"
            >
              <Typography className="text-[18px]" textColor="gray">
                Статистика
              </Typography>
            </TabsTrigger>
            {/* {currentUser.nickname !== nickname && (
              <TabsTrigger
                value="friends"
                className="duration-300 transition-all ease-in-out 
                data-[state=inactive]:bg-transparent data-[state=active]:bg-transparent 
                data-[state=active]:decoration-2 data-[state=active]:underline 
                data-[state=active]:underline-offset-8 data-[state=active]:decoration-shark-50 !p-0"
              >
                <Typography className="text-[18px]" textColor="gray">
                  Общие друзья
                </Typography>
              </TabsTrigger>
            )} */}
          </TabsList>
          <TabsContent value="stats">
            <div className="flex flex-col gap-y-2 w-full">
              <div className="flex items-center gap-1 w-full">
                <Typography textSize="small">
                  Друзей:
                </Typography>
                <Typography className="truncate" textSize="small">
                  {friends_count}
                </Typography>
              </div>
              <div className="flex items-center gap-1 w-full">
                <Typography textSize="small">
                  Тем:
                </Typography>
                <Typography className="truncate" textSize="small">
                  {threads_count}
                </Typography>
              </div>
            </div>
          </TabsContent>
          {/* {currentUser.nickname !== nickname && (
            <TabsContent value="friends">
              {shared_friends && shared_friends.length > 0 && (
                <div className="flex flex-col gap-y-2 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    {shared_friends.map((friend) => (
                      <div key={friend} className="flex items-center gap-1 w-full">
                        <Typography textSize="small">
                          {friend}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(!shared_friends || !shared_friends.length) && (
                <Typography textSize="small">
                  Нет общих друзей
                </Typography>
              )}
            </TabsContent>
          )} */}
        </Tabs>
        <div className="flex items-end justify-end h-full w-full">
          <Suspense>
            <FriendButton recipient={nickname} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export const UserSummaryCard = ({ nickname }: Pick<UserEntity, "nickname">) => {
  const { data: userCard, isLoading, isError } = userCardQuery(nickname);

  if (isLoading) return <UserSummaryCardSkeleton />;

  if (!userCard || isError) return null;

  return (
    <div
      className="flex flex-col h-[512px] relative w-full border-2 border-shark-900 overflow-hidden rounded-lg bg-shark-900 items-center"
    >
      {userCard.status === 'blocked' && (
        <Suspense>
          <UserSummaryCardPrivated />
        </Suspense>
      )}
      {userCard.status === 'private' && (
        <Suspense>
          <UserSummaryCardPrivated />
        </Suspense>
      )}
      {userCard.status === 'banned' && (
        <Suspense>
          <UserSummaryCardLimited title="Пользователь забанен" />
        </Suspense>
      )}
      {userCard.status === 'default' && userCard.data &&  <UserDetailed {...userCard.data} /> }
    </div>
  );
};

{/* {(favoriteItem && favoriteItem.image) && (
            <>
              <ImageWrapper
                className="absolute -top-10 rotate-45 -right-10"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -top-10 -rotate-45 -left-10"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -bottom-8 -rotate-45 -right-8"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
              <ImageWrapper
                className="absolute -bottom-8 rotate-45 -left-8"
                propSrc={favoriteItem.image}
                propAlt={`Favorite Item`}
                width={64}
                height={64}
              />
            </>
          )} */}