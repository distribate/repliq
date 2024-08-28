import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Avatar } from '../../../../user/components/avatar/components/avatar.tsx';

export const FriendsStatistics = () => {
  return (
    <div className="flex flex-col gap-4 bg-shark-950 w-full border border-shark-800 rounded-lg p-4">
      <div className="flex flex-col gap-2 w-full">
        <Typography className="text-lg font-medium">
          Ваш самый лучший друг
        </Typography>
        <div className="flex items-center gap-2 w-fit font-[Minecraft]">
          <Avatar nickname="pureawake" propWidth={36} propHeight={36} />
          <Typography textSize="medium">
            pureawake
          </Typography>
        </div>
      </div>
    </div>
  )
}