import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from '#components/user/components/avatar/components/avatar.tsx';
import { UserNickname } from "#components/user/components/name/nickname.tsx";
import { UserDonate } from "#components/user/components/donate/components/donate.tsx";
import dayjs from "@repo/shared/constants/dayjs-instance.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { closeSummaryCardAction, userCardAction } from "../models/user-main-card.model.ts";
import { WindowLoader } from "@repo/ui/src/components/window-loader.tsx";

const UserSummaryCardPrivated = () => {
  return (
    <div className="flex w-full items-center justify-center h-full relative z-[4]">
      <div className="flex flex-col items-center gap-6 p-6">
        <div className="flex flex-col items-center gap-y-2">
          <Typography className="text-xl text-center font-bold text-shark-50">
            Пользователь предпочел скрыть свою информацию.
          </Typography>
          <Typography className="text-shark-300 text-center text-base">
            Добавьте в друзья, чтобы увидеть содержимое профиля
          </Typography>
        </div>
      </div>
    </div>
  )
}

type UserSummaryCardLimitedProps = {
  title: string
}

const UserSummaryCardLimited = ({
  title
}: UserSummaryCardLimitedProps) => {
  return (
    <Typography className="text-center">
      {title}
    </Typography>
  )
}

const UserStats = reatomComponent(({ ctx }) => {
  const user = ctx.spy(userCardAction.dataAtom)?.data
  if (!user) return null;

  const details = user.details
  if (!details) return null

  const { friends_count, threads_count } = details

  return (
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
  )
}, "UserStats")

const UserMain = reatomComponent(({ ctx }) => {
  const user = ctx.spy(userCardAction.dataAtom)?.data
  if (!user) return null;

  const details = user.details;
  if (!details) return null;

  const { created_at, description } = details;

  const joinedAt = dayjs(created_at).format("Присоединился в DD.MM.YYYY");

  return (
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
          Участник Repliq:
        </Typography>
        <div className="flex items-center gap-2">
          <Typography textSize="small">
            {joinedAt}
          </Typography>
        </div>
      </div>
    </div>
  )
}, "UserMain")

const UserHead = reatomComponent(({ ctx }) => {
  const user = ctx.spy(userCardAction.dataAtom)?.data
  if (!user) return null;

  const details = user.details;

  const { nickname, avatar, is_donate, name_color } = user

  return (
    <div className="flex items-center gap-4 p-4 w-full">
      <div className="flex relative justify-center cursor-pointer min-h-24 h-24 max-h-24 aspect-square items-center">
        <Avatar
          nickname={nickname}
          propWidth={96}
          url={avatar}
          propHeight={96}
          className="min-h-24 h-24 max-h-24 aspect-square"
          onClick={() => closeSummaryCardAction(ctx, "link")}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <UserNickname
              nickname={nickname}
              nicknameColor={name_color}
              className="cursor-pointer text-lg"
              onClick={() => closeSummaryCardAction(ctx, "link")}
            />
            {is_donate && <UserDonate />}
          </div>
          {details && details.real_name && (
            <span className="text-shark-300 text-md">
              aka {details.real_name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}, "UserHead")

const UserSummaryTabs = reatomComponent(({ ctx }) => {
  const user = ctx.spy(userCardAction.dataAtom)
  if (!user) return null;

  return (
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
  )
}, "UserSummaryTabs")

const UserSummaryWrapper = reatomComponent(({ ctx }) => {
  const user = ctx.spy(userCardAction.dataAtom)
  if (!user) return null;

  const { status } = user;

  const isBanned = status === 'banned'

  if (isBanned) {
    return <UserSummaryCardLimited title="Пользователь забанен" />
  }

  const isBlocked = status === 'blocked';
  const isPrivated = status === 'private'

  if (isBlocked || isPrivated) {
    return <UserSummaryCardPrivated />
  }

  return <UserSummary />
}, "UserSummaryWrapper")

const UserSummary = reatomComponent(({ ctx }) => {
  const user = ctx.spy(userCardAction.dataAtom)
  if (!user) return null;

  const data = user.data;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 p-4 items-center w-full bg-shark-950/40 h-full rounded-t-lg">
      <UserMain />
      <Separator />
      <UserSummaryTabs />
      <div className="flex items-end justify-end h-full w-full">
        <FriendButton recipient={data.nickname} />
      </div>
    </div>
  )
}, "UserSummary")

export const UserSummaryCard = reatomComponent(({ ctx }) => {
  const isLoading = ctx.spy(userCardAction.statusesAtom).isPending

  return (
    <div
      className="flex items-center justify-center py-2 
        overflow-y-auto max-h-[440px] sm:h-[512px] relative w-full overflow-x-hidden rounded-xl bg-shark-900"
    >
      {isLoading ? (
        <WindowLoader />
      ) : (
        <div className="flex flex-col h-full w-full items-center">
          <UserHead />
          <UserSummaryWrapper />
        </div>
      )}
    </div>
  );
}, "UserSummaryCard")