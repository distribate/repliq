import { PageWrapper } from '#components/wrappers/components/page-wrapper'
import AdventureInBlossom from '@repo/assets/images/adventure-in-blossom.jpg'
import Compass from '@repo/assets/images/minecraft/compass.webp'
import Spyglass from '@repo/assets/images/minecraft/spyglass.webp'
import { USER_URL } from '@repo/shared/constants/routes'
import { UserNotExistCounter } from '#components/templates/components/user-not-exist-counter'
import { CustomLink } from '#components/shared/link'
import { notExistRoute } from '#routes/public-routes'

export function NotExistRouteComponent() {
  const params = notExistRoute.useSearch() as {
    redirect_nickname: string
    timeout: string
  }

  if (!params.redirect_nickname || !params.timeout) return null

  const { redirect_nickname, timeout } = params

  return (
    <PageWrapper className="flex flex-col gap-y-6">
      <div className="flex overflow-hidden rounded-md w-fit max-w-[890px] h-fit max-h-[450px] border-[1px] border-white/50">
        <img
          src={AdventureInBlossom}
          alt=""
          width={1200}
          height={1240}
          loading="lazy"
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-4">
        <p className="text-5xl font-[Minecraft] text-white">Юзер не найден {`;(`}</p>
        <div className="flex py-0.5 rounded-xl items-center gap-1 justify-between bg-white/30 backdrop-blur-md overflow-hidden">
          <CustomLink to="/">
            <div className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]">
              <img
                src={Compass}
                width={48}
                height={48}
                alt="Compass"
                loading="lazy"
                className="max-w-[32px] max-h-[32px]"
              />
              <p className="text-md font-semibold font-[Minecraft] text-shark-200">главная</p>
            </div>
          </CustomLink>
          <span>|</span>
          <CustomLink to={USER_URL + redirect_nickname}>
            <div className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]">
              <img
                src={Spyglass}
                width={48}
                height={48}
                alt="Compass"
                loading="lazy"
                className="max-w-[26px] max-h-[26px]"
              />
              <p className="text-md font-semibold font-[Minecraft] text-shark-200">к профилю</p>
            </div>
          </CustomLink>
        </div>
        <UserNotExistCounter
          redirectUser={redirect_nickname as string}
          redirectTimeout={timeout as string}
        />
      </div>
    </PageWrapper>
  )
}