import { Button } from "@repo/ui/src/components/button"
import { Typography } from "@repo/ui/src/components/typography"
import { useNavigate } from "@tanstack/react-router"

export const AuthorizationButton = () => {
  const navigate = useNavigate()

  return (
    <Button onClick={() => navigate({ to: "/auth" })} className="flex items-center rounded-lg bg-shark-50 h-10 px-6">
      <Typography textSize="large" className="text-shark-900 font-semibold">
        Авторизоваться
      </Typography>
    </Button>
  )
}