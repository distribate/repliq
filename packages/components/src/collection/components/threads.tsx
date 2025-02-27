import { getThreadsUser } from "#profile/components/threads/queries/get-threads-user.ts";
import { getUser } from "@repo/lib/helpers/get-user";
import { Typography } from "@repo/ui/src/components/typography";
import { useQuery } from "@tanstack/react-query";
import FancyFeather from "@repo/assets/images/minecraft/fancy_feather.webp"
import { Link } from "@tanstack/react-router";
import { THREAD_URL } from "@repo/shared/constants/routes";

const myThreadsQuery = (nickname: string) => useQuery({
  queryKey: ["my-threads"],
  queryFn: () => getThreadsUser({ nickname })
});

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

export const MyThreads = () => {
  const currentUser = getUser()
  const { data: threads, isLoading } = myThreadsQuery(currentUser.nickname)

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
              <Link to={THREAD_URL + t.id} className="bg-shark-50 flex items-center justify-center w-2/4 px-4 py-2 rounded-lg">
                <Typography
                  textColor="shark_black"
                  textSize="medium"
                  className='font-semibold'
                >
                  Перейти к треду
                </Typography>
              </Link>
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
}