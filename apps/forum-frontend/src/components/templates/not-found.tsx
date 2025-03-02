import { PageWrapper } from '#components/wrappers/page-wrapper.tsx'
import AdventureInBlossom from '@repo/assets/images/adventure-in-blossom.jpg'
import Compass from '@repo/assets/images/minecraft/compass.webp'
import { Link } from '@tanstack/react-router'

export const NotFound = () => {
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
        <p className="text-5xl font-[Minecraft] text-white">
          Ресурс не найден {`;(`}
        </p>
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
              <p className="text-md font-semibold font-[Minecraft] text-shark-200">главная</p>
            </div>
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}