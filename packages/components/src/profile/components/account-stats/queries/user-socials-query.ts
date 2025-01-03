import { useQuery } from '@tanstack/react-query'
import { getUserSocials } from './get-user-socials'
import { createQueryKey } from '@repo/lib/helpers/query-key-builder'

export const USER_SOCIALS_QUERY_KEY = createQueryKey("user", ['socials'])

type UserSocials = {
  TELEGRAM_ID: string | null,
  DISCORD_ID: string | null
} | null

export const userSocialsQuery = () => useQuery<UserSocials, Error>({
  queryKey: USER_SOCIALS_QUERY_KEY,
  queryFn: () => getUserSocials(),
  refetchOnWindowFocus: false
})