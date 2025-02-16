import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { getUser } from "@repo/lib/helpers/get-user";
import { LAND_URL, USER_URL } from "@repo/shared/constants/routes";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { Link } from "@tanstack/react-router";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes, Suspense } from "react";

const ratingCardVariants = cva("grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full p-2 rounded-lg", {
  variants: {
    variant: {
      default: "bg-shark-900 hover:bg-shark-800 border border-shark-800",
      selected: "bg-gradient-to-r from-shark-800 via-shark-800 from-[5%] via-90% to-green-700 border border-shark-800",
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

export const RatingLandsCard = ({
  land, chunks_amount, members, name, type, idx, blocks
}: RatingLandsCardProps) => {
  const currentUser = getUser()

  const isOwner = currentUser.nickname === Object.keys(members)[0]

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Link to={LAND_URL + land}>
          <Typography className="text-[18px]">
            {name}
          </Typography>
        </Link>
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
}

export const RatingReputationCard = ({
  nickname, reputation, uuid, idx
}: RatingReputationCardProps) => {
  const currentUser = getUser()

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-[42px] w-[42px]" />}>
          <Link to={USER_URL + nickname}>
            <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
          </Link>
        </Suspense>
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </Link>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {reputation}
        </Typography>
      </div>
    </RatingCard>
  )
}

export const RatingCharismCard = ({
  Balance, username: nickname, idx
}: RatingCharismCardProps) => {
  const currentUser = getUser()

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-[42px] w-[42px]" />}>
          <Link to={USER_URL + nickname}>
            <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
          </Link>
        </Suspense>
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </Link>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {Math.floor(Balance ?? 0)}
        </Typography>
      </div>
    </RatingCard>
  )
}

export const RatingBelkoinCard = ({
  points, username: nickname, idx
}: RatingBelkoinCardProps) => {
  const currentUser = getUser()

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-[42px] w-[42px]" />}>
          <Link to={USER_URL + nickname}>
            <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
          </Link>
        </Suspense>
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </Link>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {Math.floor(points ?? 0)}
        </Typography>
      </div>
    </RatingCard>
  )
}

export const RatingParkourCard = ({
  gamesplayed, player, score, area, name: nickname, idx
}: RatingParkourCardProps) => {
  const currentUser = getUser()

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-[42px] w-[42px]" />}>
          <Link to={USER_URL + nickname}>
            <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
          </Link>
        </Suspense>
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </Link>
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
}

export const RatingPlaytimeCard = ({
  TotalPlayTime, username: nickname, idx
}: RatingPlaytimeCardProps) => {
  const currentUser = getUser()

  const isOwner = currentUser.nickname === nickname

  return (
    <RatingCard variant={isOwner ? "selected" : "default"}>
      <div className="flex items-center justify-center">
        <Typography textSize="large" className="font-semibold">
          {idx + 1}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-[42px] w-[42px]" />}>
          <Link to={USER_URL + nickname}>
            <Avatar nickname={nickname || "a"} propHeight={42} propWidth={42} />
          </Link>
        </Suspense>
        <Link to={USER_URL + nickname}>
          <UserNickname nickname={nickname!} className="text-[18px] truncate" />
        </Link>
      </div>
      <div className="flex items-center justify-start relative -left-1">
        <Typography textSize="large">
          {Math.floor(dayjs.duration(TotalPlayTime ?? 0).asHours())} часа(-ов)
        </Typography>
      </div>
    </RatingCard>
  )
}