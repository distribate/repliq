import { Button } from "@repo/ui/src/components/button"
import { Typography } from "@repo/ui/src/components/typography"
import { navigate } from "vike/client/router"

export const AuthorizationButton = () => {
  return (
    <Button onClick={() => navigate("/auth")} className="flex items-center rounded-lg bg-shark-50 h-10 px-6">
      <Typography textSize="large" className="text-shark-900 font-semibold">
        Авторизоваться
      </Typography>
    </Button>
  )
}