import { reatomComponent } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { factResource } from "../models/fact-section.model";

export const FactSection = reatomComponent(({ ctx }) => {
  const data = ctx.spy(factResource.dataAtom)

  return (
    <div className="flex gap-1 select-none relative bg-shark-200 minecraft-panel w-full items-start py-2 px-4 lg:px-10 overflow-x-auto">
      {ctx.spy(factResource.statusesAtom).isPending ? (
        <Skeleton className="h-8 w-full" />
      ) : (
        <Typography
          font="minecraft"
          className="text-shark-800 text-[14px] lg:text-base font-semibold"
        >
          Факт: <span className="whitespace-normal font-medium">{data ? data : "ничего не нашлось"}</span>
        </Typography>
      )}
    </div>
  )
}, "FactSection")