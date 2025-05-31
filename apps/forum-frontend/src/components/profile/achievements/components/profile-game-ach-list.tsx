import { Typography } from "@repo/ui/src/components/typography.tsx";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { reatomComponent } from "@reatom/npm-react";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { achievementsAction, achievementsAtom, achievementsMetaAtom } from "../models/achievements.model";

const AchievementsItem = ({ title, image, description }: { title: string, description: string, image: string }) => {
  return (
    <div className="flex flex-col items-center justify-center aspect-video w-full h-full bg-shark-950 rounded-lg p-2">
      <img
        src={image}
        alt={title}
        width={96}
        height={96}
        className="h-[96px] w-[96px] lg:w-[116px] lg:h-[116px] object-cover rounded-lg"
      />
      <Typography className="text-lg font-bold text-shark-50">
        {title}
      </Typography>
      <Typography className="text-base text-shark-300">
        {description}
      </Typography>
    </div>
  )
}

export const ProfileGameAch = reatomComponent(({ ctx }) => {
  if (ctx.spy(achievementsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  const meta = ctx.spy(achievementsMetaAtom)
  const achievements = ctx.spy(achievementsAtom)

  if (!meta || !achievements) return null

  const filtered = (ach: string) => achievements.filter(a => a.type === ach)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
        <Typography textColor="shark_white" textSize="big" className="font-semibold">
            Достижения {ctx.spy(requestedUserParamAtom)}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full h-full">
        {meta.achievementsTypes.map(ach => (
          <div key={ach.key} className="flex flex-col gap-2 w-full h-full">
            <Typography className="text-[18px] font-semibold">
              {ach.title}
            </Typography>
            {filtered(ach.key).length >= 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto w-full gap-4">
                {filtered(ach.key).map((ach) => (
                  <AchievementsItem
                    key={ach.type}
                    title={ach.details.title}
                    description={ach.details.description}
                    image={ach.details.img}
                  />
                ))}
              </div>
            )}
            {!filtered(ach.key).length && (
              <Typography className="text-shark-50 text-base">
                Пусто
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}, "ProfileGameAch")