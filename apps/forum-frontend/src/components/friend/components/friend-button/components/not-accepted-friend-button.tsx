import { Button } from "@repo/ui/src/components/button"
import { Typography } from "@repo/ui/src/components/typography"

export const FriendNotAcceptedButton = () => {
  return (
    <Button state="default" className="flex items-center gap-2">
      <Typography>Не принимает заявки в друзья</Typography>
    </Button>
  )
}