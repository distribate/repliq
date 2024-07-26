import { Typography } from '@repo/ui/src/components/typography.tsx';

export const ThreadNotFound = () => {
  return (
    <div className="px-2 w-full">
      <Typography textSize="medium" className="text-shark-300">
        Тредов в этой категории ещё нет...
      </Typography>
    </div>
  )
}