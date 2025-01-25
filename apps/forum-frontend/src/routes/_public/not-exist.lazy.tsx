import { createLazyFileRoute } from '@tanstack/react-router'
import { PageWrapper } from '@repo/components/src/wrappers/page-wrapper'
import AdventureInBlossom from '@repo/assets/images/adventure-in-blossom.jpg'
import Compass from '@repo/assets/images/minecraft/compass.webp'
import Spyglass from '@repo/assets/images/minecraft/spyglass.webp'
import { Link } from '@tanstack/react-router'
import { USER_URL } from '@repo/shared/constants/routes'
import { UserNotExistCounter } from '@repo/components/src/templates/user-not-exist-counter.tsx'

export const Route = createLazyFileRoute('/_public/not-exist')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      redirect_nickname: search.redirect_nickname as string,
      timeout: search.timeout as string,
    }
  },
})

function RouteComponent() {
  const params = Route.useSearch() as {
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
        <p className="text-5xl font-[Pixy] text-white">Юзер не найден {`;(`}</p>
        <div className="flex py-0.5 rounded-xl items-center gap-1 justify-between bg-white/30 backdrop-blur-md overflow-hidden">
          <Link to="/">
            <div className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]">
              <img
                src={Compass}
                width={48}
                height={48}
                alt="Compass"
                loading="lazy"
                className="max-w-[32px] max-h-[32px]"
              />
              <p className="text-md font-semibold text-shark-200">главная</p>
            </div>
          </Link>
          <span>|</span>
          <Link to={USER_URL + redirect_nickname}>
            <div className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]">
              <img
                src={Spyglass}
                width={48}
                height={48}
                alt="Compass"
                loading="lazy"
                className="max-w-[26px] max-h-[26px]"
              />
              <p className="text-md font-semibold text-shark-200">к профилю</p>
            </div>
          </Link>
        </div>
        <UserNotExistCounter
          redirectUser={redirect_nickname as string}
          redirectTimeout={timeout as string}
        />
      </div>
    </PageWrapper>
  )
}
