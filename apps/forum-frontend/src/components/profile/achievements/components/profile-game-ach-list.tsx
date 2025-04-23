import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { achievementsClient } from "@repo/shared/api/minecraft-client";
import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";

type ProfileGameAchProps = Pick<UserEntity, "nickname">;

async function getAchievements(nickname: string) {
  const res = await achievementsClient.achievements["get-achievements"][":nickname"].$get({
    param: { nickname }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null
  }

  return data.data
}

async function getAchievementsMeta() {
  const res = await achievementsClient.achievements["get-achievements-meta"].$get()

  const data = await res.json()

  if (!data || "error" in data) {
    return null
  }

  return data.data
}

const achievementsMetaQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["achievements-meta"]),
  queryFn: () => getAchievementsMeta(),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

const achievementsQuery = (nickname: string) => useQuery({
  queryKey: createQueryKey("ui", ["achievements", nickname]),
  queryFn: () => getAchievements(nickname),
  refetchOnWindowFocus: false,
})

export const ProfileGameAch = ({ nickname }: ProfileGameAchProps) => {
  const { data: meta } = achievementsMetaQuery()
  const { data: achievements, isLoading } = achievementsQuery(nickname)

  if (isLoading) return <SectionSkeleton/>

  if (!meta || !achievements) return null

  const filtered = (ach: string) => achievements.filter(a => a.type === ach)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography
            textColor="shark_white"
            className="text-[22px] font-semibold"
          >
            Достижения {nickname}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full h-full">
        {meta?.achievementsTypes?.map((ach) => (
          <div key={ach.key} className="flex flex-col gap-2 w-full h-full">
            <Typography className="text-[18px] font-semibold">
              {ach.title}
            </Typography>
            {filtered(ach.key).length ? (
              <div className="grid grid-cols-3 auto-rows-auto w-full gap-4">
                {filtered(ach.key).map((ach) => (
                  <div
                    key={ach.type}
                    className="flex flex-col items-center justify-center aspect-video w-full h-full bg-shark-950 rounded-lg p-2"
                  >
                    {ach.details.img && (
                      <img
                        src={ach.details.img}
                        alt=""
                        width={96}
                        height={96}
                        className="h-[96px] w-[96px] lg:w-[116px] lg:h-[116px] object-cover rounded-lg"
                      />
                    )}
                    <Typography className="text-lg font-bold text-shark-50">
                      {ach.details.title}
                    </Typography>
                    <Typography className="text-base text-shark-300">
                      {ach.details.description}
                    </Typography>
                  </div>
                ))}
              </div>
            ) : (
              <Typography className="text-shark-50 text-base">
                Пусто
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
