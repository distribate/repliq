import { Typography } from "@repo/ui/src/components/typography"

type UserSummaryCardLimitedProps = {
  title: string
}

export const UserSummaryCardLimited = ({
  title
}: UserSummaryCardLimitedProps) => {
  return (
    <div>
      <Typography className="text-center">
        {title}
      </Typography>
    </div>
  )
}