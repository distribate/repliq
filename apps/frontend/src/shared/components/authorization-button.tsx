import { Button } from "@repo/ui/src/components/button"
import { Typography } from "@repo/ui/src/components/typography"
import { navigate } from "vike/client/router"
import { prefetch } from 'vike/client/router'

export const AuthorizationButton = () => {
  const handle = async () => {
    prefetch("/auth")
    await navigate("/auth")
  }

  return (
    <Button
      className="flex items-center rounded-lg bg-shark-50 h-10 px-6"
      onClick={handle}
    >
      <Typography textSize="large" className="text-shark-900 font-semibold">
        Авторизоваться
      </Typography>
    </Button>
  )
}