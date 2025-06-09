import { CustomLink } from "#components/shared/link";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { reatomComponent } from "@reatom/npm-react";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { getUser } from "@repo/lib/helpers/get-user";
import { createIdLink } from "@repo/lib/utils/create-link";
import { Typography } from "@repo/ui/src/components/typography";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

const ratingCardVariants = cva("grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full p-2 rounded-lg", {
  variants: {
    variant: {
      default: "bg-shark-950 hover:bg-shark-900",
      selected: "bg-gradient-to-r from-shark-800 via-shark-800 from-[5%] via-90% to-green-700",
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type RatingCardProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof ratingCardVariants>

const RatingCard = forwardRef<HTMLDivElement, RatingCardProps>(({
  variant, className, ...props
}, ref) => {
  return (
    <div ref={ref} className={ratingCardVariants({ variant, className })} {...props} />
  )
})

type RatingInitial = {
  idx: number
}

export type RatingPlaytimeCardProps = RatingInitial & {
  TotalPlayTime: number | null;
  username: string | null;
}

export type RatingParkourCardProps = RatingInitial & {
  gamesplayed: number | null
  player: string | null,
  score: number | null;
  area: string | null;
  name: string | null;
}

export type RatingBelkoinCardProps = RatingInitial & {
  username: string | null;
  points: number | null;
}

export type RatingCharismCardProps = RatingInitial & {
  Balance: number | null;
  username: string | null;
}

export type RatingReputationCardProps = RatingInitial & {
  reputation: number;
  uuid: string | null;
  nickname: string | null;
}

export type RatingLandsCardProps = RatingInitial & {
  land: string;
  chunks_amount: number;
  members: {
    [key: string]: {
      chunks: number;
    }
  };
  name: string;
  type: string;
  blocks: any
}

export const RatingLandsCard = reatomComponent<RatingLandsCardProps>(({
  ctx, land, chunks_amount, members, name, type, idx, blocks
}) => {
  const currentUser = getUser(ctx)

  const isOwner = currentUser.nickname === Object.keys(members)[0]

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("land", land)}>
          <Typography className="text-[18px]">
            {name}
          </Typography>
        </CustomLink>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {chunks_amount}
        </Typography>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {type}
        </Typography>
      </div>
    </RatingCard>
  )
}, "RatingLandsCard")

export const RatingReputationCard = reatomComponent<RatingReputationCardProps>(({
  nickname, reputation, uuid, idx, ctx
}) => {
  const currentUser = getUser(ctx)

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", nickname!)}>
          <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
        </CustomLink>
        <CustomLink to={createIdLink("user", nickname!)}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </CustomLink>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {reputation}
        </Typography>
      </div>
    </RatingCard>
  )
}, "RatingReputationCard")

export const RatingCharismCard = reatomComponent<RatingCharismCardProps>(({
  Balance, username: nickname, idx, ctx
}) => {
  const currentUser = getUser(ctx)

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", nickname!)}>
          <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
        </CustomLink>
        <CustomLink to={createIdLink("user", nickname!)}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </CustomLink>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {Math.floor(Balance ?? 0)}
        </Typography>
      </div>
    </RatingCard>
  )
}, "RatingCharismCard")

export const RatingBelkoinCard = reatomComponent<RatingBelkoinCardProps>(({
  points, username: nickname, idx, ctx
}) => {
  const currentUser = getUser(ctx)

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", nickname!)}>
          <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
        </CustomLink>
        <CustomLink to={createIdLink("user", nickname!)}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </CustomLink>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {Math.floor(points ?? 0)}
        </Typography>
      </div>
    </RatingCard>
  )
}, "RatingBelkoinCard")

export const RatingParkourCard = reatomComponent<RatingParkourCardProps>(({
  gamesplayed, player, score, area, name: nickname, idx, ctx
}) => {
  const currentUser = getUser(ctx)

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", nickname!)}>
          <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
        </CustomLink>
        <CustomLink to={createIdLink("user", nickname!)}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </CustomLink>
      </div>
      <div className="flex items-center justify-start">
        <Typography textSize="large">
          {area}
        </Typography>
      </div>
      <div className="flex items-center justify-start">
        <Typography textSize="large">
          {score}
        </Typography>
      </div>
    </RatingCard>
  )
}, "RatingParkourCard")

export const RatingPlaytimeCard = reatomComponent<RatingPlaytimeCardProps>(({
  TotalPlayTime, username: nickname, idx, ctx
}) => {
  const currentUser = getUser(ctx)

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", nickname!)}>
          <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
        </CustomLink>
        <CustomLink to={createIdLink("user", nickname!)}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </CustomLink>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {Math.floor(dayjs.duration(TotalPlayTime ?? 0).asHours())} часа(-ов)
        </Typography>
      </div>
    </RatingCard>
  )
}, "RatingPlaytimeCard")