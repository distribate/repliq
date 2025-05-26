import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from '#components/user/avatar/components/avatar.tsx';
import { UserNickname } from "#components/user/name/nickname.tsx";
import { UserDonate } from "#components/user/donate/components/donate.tsx";
import Glass from "@repo/assets/images/minecraft/glass.webp";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { controlUserCardAtom, userCardResource } from "../models/user-main-card.model.ts";
import { UserRealName } from "#components/user/real-name/real-name.tsx";
import { WindowLoader } from "@repo/ui/src/components/window-loader.tsx";

const SummaryCardPrivated = lazy(() => import("./user-summary-card-privated.tsx").then(m => ({ default: m.UserSummaryCardPrivated })))
const SummaryCardLimited = lazy(() => import("./user-summary-card-limited.tsx").then(m => ({ default: m.UserSummaryCardLimited })))

const UserStats = reatomComponent(({ ctx }) => {
  const userCard = ctx.spy(userCardResource.dataAtom)?.data
  if (!userCard) return null;

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <div className="flex items-center gap-1 w-full">
        <Typography textSize="small">
          Друзей:
        </Typography>
        <Typography className="truncate" textSize="small">
          {userCard.friends_count}
        </Typography>
      </div>
      <div className="flex items-center gap-1 w-full">
        <Typography textSize="small">
          Тем:
        </Typography>
        <Typography className="truncate" textSize="small">
          {userCard.threads_count}
        </Typography>
      </div>
    </div>
  )
}, "UserStats")

const UserMain = reatomComponent(({ ctx }) => {
  const userCard = ctx.spy(userCardResource.dataAtom)?.data
  if (!userCard) return null;

  const joinedAt = dayjs(userCard.created_at).format("Присоединился в DD.MM.YYYY");

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      {userCard.description && (
        <div className="flex flex-col gap-y-1 w-full">
          <Typography>Описание</Typography>
          <div className="flex bg-shark-900 rounded-sm overflow-hidden px-2 py-0.5">
            <Typography className="whitespace-normal" textSize="small">
              {userCard.description}
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
  )
})

const UserHead = reatomComponent(({ ctx }) => {
  const userCard = ctx.spy(userCardResource.dataAtom)?.data
  if (!userCard) return null;

  const { nickname, real_name, donate } = userCard

  return (
    <div className="flex items-center gap-4 p-4 w-full">
      <div className="flex relative justify-center p-2 items-center">
        <div className="z-1 absolute w-full h-full right-0 left-0 bottom-0 top-0">
          <img src={Glass} alt="" width={104} height={104} />
        </div>
        <Avatar
          nickname={nickname}
          propWidth={88}
          propHeight={88}
          className="z-2 relative !rounded-none cursor-pointer"
          onClick={() => controlUserCardAtom(ctx, false, "link")}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <UserNickname
            nickname={nickname}
            nicknameColor={`#ffffff`}
            className="cursor-pointer"
            onClick={() => controlUserCardAtom(ctx, false, "link")}
          />
          {real_name && <UserRealName real_name={real_name} />}
        </div>
        <div className="w-fit">
          <UserDonate donate={donate} />
        </div>
      </div>
    </div>
  )
})

const UserSummary = reatomComponent(({ ctx }) => {
  const userCard = ctx.spy(userCardResource.dataAtom)
  if (!userCard) return null;

  const isBanned = userCard.status === 'banned'

  if (isBanned) {
    return (
      <Suspense>
        <SummaryCardLimited title="Пользователь забанен" />
      </Suspense>
    )
  }

  const isBlocked = userCard.status === 'blocked';
  const isPrivated = userCard.status === 'private'

  if (isBlocked || isPrivated) {
    return (
      <Suspense>
        <SummaryCardPrivated />
      </Suspense>
    )
  }

  if (!userCard.data) return null;

  if (userCard.status === 'default') {
    const { nickname } = userCard.data

    return (
      <>
        <UserHead />
        <div className="flex flex-col gap-y-4 p-4 items-center w-full bg-shark-950 h-full rounded-t-lg">
          <UserMain />
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
              <UserStats />
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
            <FriendButton recipient={nickname} />
          </div>
        </div>
      </>
    )
  }
}, "UserSummary")

export const UserSummaryCard = reatomComponent(({ ctx }) => {
  return (
    <div
      className="flex items-center justify-center h-[440px] sm:h-[512px] relative w-full border-shark-900 overflow-hidden rounded-lg bg-shark-900"
    >
      {ctx.spy(userCardResource.statusesAtom).isPending ? <WindowLoader /> : (
        <div
          className="flex flex-col h-full relative w-full rounded-lg items-center"
        >
          <UserSummary />
        </div>
      )}
    </div>
  );
}, "UserSummaryCard")