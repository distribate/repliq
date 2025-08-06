import { Typography } from "@repo/ui/src/components/typography"

type UserSummaryCardLimitedProps = {
  title: string
}

export const UserSummaryCardLimited = ({
  title
}: UserSummaryCardLimitedProps) => {
  return (
    <Typography className="text-center">
      {title}
    </Typography>
  )
}