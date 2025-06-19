import { UserNotExistCounter } from '#components/templates/components/user-not-exist-counter'
import { CustomLink } from '#components/shared/link'
import { notExistRoute } from '#routes/public-routes'
import { createIdLink } from '@repo/lib/utils/create-link'

export function NotExistRouteComponent() {
  const params = notExistRoute.useSearch() as { redirect_nickname: string }

  if (!params.redirect_nickname) return null

  const { redirect_nickname } = params

  return (
    <div className="flex overflow-hidden px-4 flex-col gap-y-6 h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <p className="text-5xl text-white">Юзер не найден {`;(`}</p>
        <div className="flex py-0.5 rounded-xl items-center gap-1 justify-between bg-white/30 backdrop-blur-md overflow-hidden">
          <CustomLink to="/">
            <div className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]">
              <p className="text-md font-semibold text-shark-200">Главная</p>
            </div>
          </CustomLink>
          <span>|</span>
          <CustomLink to={createIdLink("user", redirect_nickname)}>
            <div className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]">
              <p className="text-md font-semibold text-shark-200">К профилю</p>
            </div>
          </CustomLink>
        </div>
        <UserNotExistCounter redirectUser={redirect_nickname as string} />
      </div>
    </div>
  )
}