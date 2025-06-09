import { Typography } from "@repo/ui/src/components/typography";
import FancyFeather from "@repo/assets/images/minecraft/fancy_feather.webp"
import { myThreadsResource } from "../queries/my-threads-query";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link";
import { threadPreviewAtom } from "#components/thread/thread-main/models/thread.model";
import { createIdLink } from "@repo/lib/utils/create-link";

export const SavedThreads = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 p-4 w-full">
      <img src={FancyFeather} alt="" width={96} height={96} />
      <Typography
        textColor="shark_white"
        textSize="very_big"
        className="font-semibold"
      >
        У вас нет сохраненных тредов
      </Typography>
    </div>
  )
}

export const MyThreads = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(myThreadsResource.dataAtom)
  const isLoading = ctx.spy(myThreadsResource.statusesAtom).isPending

  return (
    <div className="flex flex-col gap-y-4 h-full w-full">
      {threads && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-auto gap-2 w-full h-fit">
          {/* @ts-ignore */}
          {threads.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-4 justify-between border-2 border-shark-700 bg-shark-950 rounded-lg p-2"
            >
              <div className="flex flex-col w-2/4 overflow-hidden">
                <Typography
                  className="truncate"
                  textColor="shark_white"
                  textSize="medium"
                >
                  {t.title}
                </Typography>
                <Typography
                  className="truncate"
                  textColor="gray"
                  textSize="small"
                >
                  {t.description}
                </Typography>
              </div>
              <CustomLink
                to={createIdLink("thread", t.id)}
                onClick={() => threadPreviewAtom(ctx, { id: t.id, title: t.title })}
                className="bg-shark-50 flex items-center justify-center w-2/4 px-4 py-2 rounded-lg"
              >
                <Typography
                  textColor="shark_black"
                  textSize="medium"
                  className='font-semibold'
                >
                  Перейти к треду
                </Typography>
              </CustomLink>
            </div>
          ))}
        </div>
      )}
      {!threads && !isLoading && (
        <div className="flex flex-col h-full items-center justify-center gap-4 p-4 w-full">
          <img src={FancyFeather} alt="" width={96} height={96} />
          <Typography
            textColor="shark_white"
            textSize="very_big"
            className="font-semibold"
          >
            Тредов еще нет :/
          </Typography>
        </div>
      )}
    </div>
  )
}, "MyThreads")