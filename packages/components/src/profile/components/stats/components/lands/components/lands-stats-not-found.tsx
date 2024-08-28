import { BlockWrapper } from '../../../../../../wrappers/block-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export const LandsStatsNotFound = () => {
  return (
      <BlockWrapper>
        <Typography textShadow="small" className="text-lg text-shark-50 font-semibold">
          Нет территорий.
        </Typography>
      </BlockWrapper>
  )
}