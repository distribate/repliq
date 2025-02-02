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
    <>

    </>
  )
}

export const MyThreads = () => {
  const currentUser = getUser()
  const { data: threads, isLoading } = myThreadsQuery(currentUser.nickname)

  return (
    <div className="flex flex-col gap-y-4 h-full w-full">
      {threads && (
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-auto gap-2 w-full h-fit">
          {/* @ts-ignore */}
          {threads.map((t) => (
            <div
              key={t.id}
              className="flex flex-col items-center aspect-video border border-shark-700 bg-shark-800 hover:bg-shark-700 rounded-md p-2"
            >
              <Typography
                textColor="shark_white"
                textSize="medium"
              >
                {t.title}
              </Typography>
              <Link to={THREAD_URL + t.id}>
                <Typography
                  textColor="shark_white"
                  textSize="medium"
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