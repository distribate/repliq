import { Typography } from "@repo/ui/src/components/typography";
import { myThreadsResource, savedThreadsResource } from "../queries/my-threads-query";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";

const ThreadItem = ({ id, title, description }: { id: string, title: string, description: string | null }) => {
  return (
    <div
      className="flex items-center gap-4 justify-between border-2 border-shark-700 bg-shark-950 rounded-lg p-2"
    >
      <div className="flex flex-col w-2/4 overflow-hidden">
        <Typography className="truncate" textColor="shark_white" textSize="medium">
          {title}
        </Typography>
        <Typography className="truncate" textColor="gray" textSize="small">
          {description}
        </Typography>
      </div>
      <CustomLink
        to={createIdLink("thread", id)}
        className="bg-shark-50 flex items-center justify-center w-2/4 px-4 py-2 rounded-lg"
      >
        <Typography textColor="shark_black" textSize="medium" className='font-semibold'>
          Перейти к треду
        </Typography>
      </CustomLink>
    </div>
  )
}

export const SavedThreads = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(savedThreadsResource.dataAtom)

  const isExist = threads && threads.length > 0

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 p-4 w-full">
      {isExist && (
        threads.map(t => (
          <ThreadItem key={t.id} id={t.id} title={t.title} description={t.description} />
        ))
      )}
      {!isExist && (
        <Typography textColor="shark_white" textSize="very_big" className="font-semibold">
          У вас нет сохраненных тредов
        </Typography>
      )}
    </div>
  )
}, "SavedThreads")

export const MyThreads = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(myThreadsResource.dataAtom)
  const isLoading = ctx.spy(myThreadsResource.statusesAtom).isPending

  return (
    <div className="flex flex-col gap-y-4 h-full w-full">
      {threads && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-auto gap-2 w-full h-fit">
          {threads.map((t) => (
            <ThreadItem key={t.id} id={t.id} title={t.title} description={t.description} />
          ))}
        </div>
      )}
      {!threads && !isLoading && (
        <div className="flex flex-col h-full items-center justify-center gap-4 p-4 w-full">
          <Typography textColor="shark_white" textSize="very_big" className="font-semibold">
            Тредов еще нет :/
          </Typography>
        </div>
      )}
    </div>
  )
}, "MyThreads")