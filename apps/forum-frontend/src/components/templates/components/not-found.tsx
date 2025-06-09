import { CustomLink } from '#components/shared/link'
import { PageWrapper } from '#components/wrappers/components/page-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { IconSquareRoundedX } from '@tabler/icons-react'

export const NotFound = () => {
  return (
    <PageWrapper className="flex flex-col gap-y-6">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <div className="flex items-center justify-center rounded-2xl p-4 bg-shark-50">
          <IconSquareRoundedX size={64} className="text-shark-950" />
        </div>
        <Typography className="text-2xl lg:text-3xl text-shark-50">
          Ресурс не найден
        </Typography>
        <div className="flex py-0.5 rounded-xl items-center gap-1 justify-between overflow-hidden">
          <CustomLink to="/" className='flex px-3 gap-1 items-center bg-white/30 backdrop-blur-md duration-150 ease-in h-10'>
            <Typography textSize="medium" className="font-semibold text-shark-100">
              На главную
            </Typography>
          </CustomLink>
        </div>
      </div>
    </PageWrapper>
  )
}