import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { LAND_URL, USER_URL } from "@repo/shared/constants/routes";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { Link, ReactNode } from "@tanstack/react-router";
import { Suspense } from "react";

export type RatingPlaytimeCardProps = {
  TotalPlayTime: number | null;
  username: string | null;
  idx: number;
}

export type RatingParkourCardProps = {
  gamesplayed: number | null
  player: string | null,
  score: number | null;
  area: string | null;
  name: string | null;
  idx: number;
}

export type RatingBelkoinCardProps = {
  username: string | null;
  points: number | null;
  idx: number;
}

export type RatingCharismCardProps = {
  Balance: number | null;
  username: string | null;
  idx: number;
}

export type RatingReputationCardProps = {
  reputation: number;
  uuid: string | null;
  nickname: string | null;
  idx: number;
}

export type RatingLandsCardProps = {
  land: string;
  chunks_amount: number;
  members: {
    [key: string]: {
      chunks: number;
    }
  };
  name: string;
  type: string;
  idx: number;
  blocks: any
}

export const RatingLandsCard = ({
  land, chunks_amount, members, name, type, idx, blocks
}: RatingLandsCardProps) => {
  return (
    <div
      className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full bg-shark-900 hover:bg-shark-800 border border-shark-800 p-2 rounded-lg"
    >
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
    </div>
  )
}

export const RatingReputationCard = ({
  nickname, reputation, uuid, idx
}: RatingReputationCardProps) => {
  return (
    <div
      className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full bg-shark-900 hover:bg-shark-800 border border-shark-800 p-2 rounded-lg"
    >
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
    </div>
  )
}

export const RatingCharismCard = ({
  Balance, username: nickname, idx
}: RatingCharismCardProps) => {
  return (
    <div
      className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full bg-shark-900 hover:bg-shark-800 border border-shark-800 p-2 rounded-lg"
    >
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
    </div>
  )
}

export const RatingBelkoinCard = ({
  points, username: nickname, idx
}: RatingBelkoinCardProps) => {
  return (
    <div
      className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full bg-shark-900 hover:bg-shark-800 border border-shark-800 p-2 rounded-lg"
    >
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
    </div>
  )
}

export const RatingParkourCard = ({
  gamesplayed, player, score, area, name: nickname, idx
}: RatingParkourCardProps) => {
  return (
    <div
      className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full bg-shark-900 hover:bg-shark-800 border border-shark-800 p-2 rounded-lg"
    >
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
    </div>
  )
}

export const RatingPlaytimeCard = ({
  TotalPlayTime, username: nickname, idx
}: RatingPlaytimeCardProps) => {
  return (
    <div
      className="grid grid-cols-[0.1fr_2.9fr_1fr_1fr] select-none grid-rows-1 gap-2 w-full bg-shark-900 hover:bg-shark-800 border border-shark-800 p-2 rounded-lg"
    >
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
    </div>
  )
}