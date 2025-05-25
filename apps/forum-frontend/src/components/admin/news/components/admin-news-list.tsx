import { newsQuery } from "@repo/lib/queries/news-query";
import { deleteNewsAction } from "./admin-create-news";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { reatomComponent } from "@reatom/npm-react";

export const NewsList = reatomComponent(({ ctx }) => {
  const { data, isLoading } = newsQuery({ limit: 12, ascending: true })

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-4 w-full overflow-x-auto">
        <Skeleton className="w-full h-[220px]" />
        <Skeleton className="w-full h-[220px]" />
        <Skeleton className="w-full h-[220px]" />
      </div>
    )
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-6 gap-4 w-full overflow-x-auto">
      {data?.data.map(n => (
        <div
          key={n.id}
          className="flex flex-col justify-between h-[220px] overflow-hidden gap-2 bg-shark-900 p-2 rounded-lg w-full"
        >
          <Typography className="font-semibold text-base">
            {n.title}
          </Typography>
          <div className="h-full overflow-hidden w-full">
            <Typography className="line-clamp-3">
              {n.description}
            </Typography>
          </div>
          <Button
            variant="negative"
            disabled={ctx.spy(deleteNewsAction.statusesAtom).isPending}
            onClick={() => deleteNewsAction(ctx, n.id)}
            className="self-end w-fit"
          >
            <Typography className="font-semibold text-[18px]">
              Удалить
            </Typography>
          </Button>
        </div>
      ))}
    </div>
  )
}, "NewsList")