import { AnimatedNumber } from "#ui/animated-number";
import { reatomComponent } from "@reatom/npm-react";
import { publicStatsResource } from "../models/forum-stats.model";
import { AtomState } from "@reatom/core";

type StatsProps = {
  title: string,
  value: number | string,
  defaultValue?: number
}

export const Stat = ({ title, value, defaultValue = 50 }: StatsProps) => {
  return (
    <div className="text-center">
      <AnimatedNumber
        className='page-title text-shark-50'
        springOptions={{
          bounce: 0,
          duration: 2000,
        }}
        value={Number(value) ?? defaultValue}
      />
      <div className="text-shark-300">{title}</div>
    </div>
  )
}

export function transformData(input: AtomState<typeof publicStatsResource.dataAtom>): { title: string, value: number }[] {
  const data = Object.entries(input).map(([key, value]) => ({
    title: STAT_TITLE_MAP[key] ?? key,
    value
  }))

  return data;
}

const STAT_TITLE_MAP: Record<string, string> = {
  "threads": "Тредов",
  "users": "Пользователей",
  "posts": "Постов"
} as const;

export const ForumStats = reatomComponent(({ ctx }) => {
  const data = transformData(ctx.spy(publicStatsResource.dataAtom))

  return data.map((stat) => <Stat key={stat.title} {...stat} />)
}, "ForumStats")