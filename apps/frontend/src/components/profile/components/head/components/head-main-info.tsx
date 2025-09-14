import dayjs from "@repo/shared/constants/dayjs-instance";
import { UserNickname } from "#components/user/components/name/nickname";
import { UserDonate } from "#components/user/components/donate/components/donate";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { requestedUserAtom } from "#components/profile/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { UserDetailed } from "@repo/types/entities/user-type";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@repo/ui/src/components/sheet";
import { atom } from "@reatom/core";
import { IconAlignJustified, IconInfoCircle, IconX } from "@tabler/icons-react";
import { Separator } from "@repo/ui/src/components/separator";

const isBirthdayAtom = atom((ctx) => {
  const requestedUser = ctx.spy(requestedUserAtom) as UserDetailed | null
  if (!requestedUser) return false;

  if (!requestedUser.birthday) return false;

  const isBirthday = dayjs(requestedUser.birthday)
    .format('MM-DD') === dayjs(new Date().toISOString().split('T')[0]).format('MM-DD')

  return isBirthday
}, "isBirthday")

const BirthdayEvent = reatomComponent(({ ctx }) => {
  const isBirthday = ctx.spy(isBirthdayAtom);
  if (!isBirthday) return null;

  return (
    <Typography className="text-xl lg:text-3xl select-none">
      🎉
    </Typography>
  )
}, "BirthdayEvent")

const sheetMainInfoIsOpenAtom = atom(false, "sheetMainInfoIsOpen")

const SheetMainInfo = reatomComponent(({ ctx }) => {
  const requestedUser = ctx.spy(requestedUserAtom) as UserDetailed | null
  if (!requestedUser) return;

  const { real_name, nickname, description } = requestedUser

  const realName: string = (real_name ? real_name.length >= 1 ? real_name : null : null) ?? "нет"

  return (
    <Sheet
      open={ctx.spy(sheetMainInfoIsOpenAtom)}
      onOpenChange={v => sheetMainInfoIsOpenAtom(ctx, v)}
    >
      <SheetContent withClose={false} side="bottom" className="flex flex-col gap-4 min-h-24 rounded-t-lg p-4">
        <SheetTitle className="hidden">Подробнее о {nickname}</SheetTitle>
        <div className="flex items-center gap-2 ">
          <SheetClose>
            <IconX size={28} />
          </SheetClose>
          <Typography className="font-semibold leading-5 text-xl">
            Подробнее о {nickname}
          </Typography>
        </div>
        <Separator />
        <div className="flex flex-col gap-6">
          {description && (
            <div className="flex items-start gap-2">
              <IconAlignJustified size={24} className="text-shark-300" />
              <Typography textColor="shark_white" textSize="medium">
                {description}
              </Typography>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Typography>
              Реальное имя:
            </Typography>
            <span className="text-shark-300 text-md">
              {realName}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}, "SheetMainInfo")

const OpenSheetCoverInfo = reatomComponent(({ ctx }) => {
  return (
    <span
      className="lg:hidden inline-flex items-center gap-1 cursor-pointer text-shark-300 select-none"
      onClick={() => sheetMainInfoIsOpenAtom(ctx, true)}
    >
      <IconInfoCircle size={14} />
      подробнее
    </span>
  )
}, "OpenSheetCoverInfo")

export const HeadMainInfo = reatomComponent(({ ctx }) => {
  const requestedUser = ctx.spy(requestedUserAtom) as UserDetailed | null
  if (!requestedUser) return;

  return (
    <div className="flex flex-col lg:items-start items-center lg:self-end justify-between h-1/2 gap-y-1">
      <SheetMainInfo />
      <div className="flex flex-col lg:items-start items-center truncate">
        <div className="flex items-center justify-center gap-1">
          <BirthdayEvent />
          <UserNickname
            nickname={requestedUser.nickname}
            nicknameColor={requestedUser.name_color}
            className="text-xl lg:text-3xl"
          />
          {requestedUser.is_donate && <UserDonate />}
        </div>
        <OpenSheetCoverInfo />
      </div>
      {requestedUser.description && (
        <div className="hidden lg:flex">
          <Typography textColor="shark_white" textSize="medium">
            {requestedUser.description}
          </Typography>
        </div>
      )}
    </div>
  );
}, "HeadMainInfo")