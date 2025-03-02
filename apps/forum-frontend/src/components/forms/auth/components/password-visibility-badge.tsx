import { useQueryClient } from "@tanstack/react-query";
import { AUTH_GLOBAL_OPTIONS_QUERY_KEY, AuthGlobalOptionsQuery, authGlobalOptionsQuery } from "../queries/auth-query";
import EnderPearl from "@repo/assets/images/minecraft/ender_pearl.webp";
import EyeOfEnder from "@repo/assets/images/minecraft/eye_of_ender.webp";

const PASSWORD_MAP: Record<"text" | "password", string> = {
  "text": EyeOfEnder,
  "password": EnderPearl
}

export const PasswordVisibilityBadge = () => {
  const qc = useQueryClient();
  const { data: { passwordVisibility } } = authGlobalOptionsQuery()

  const handlePasswordVisibility = () => {
    qc.setQueryData(AUTH_GLOBAL_OPTIONS_QUERY_KEY, (prev: AuthGlobalOptionsQuery) => ({
      passwordVisibility: prev.passwordVisibility === "password" ? "text" : "password"
    }))
  };

  return (
    <img
      className="cursor-pointer"
      src={PASSWORD_MAP[passwordVisibility]}
      alt=""
      width={36}
      height={36}
      loading="lazy"
      onClick={handlePasswordVisibility}
    />
  )
}
