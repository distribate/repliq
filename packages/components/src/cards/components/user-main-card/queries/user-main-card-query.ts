import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { getUserMainInformation } from './get-user-main-information.ts';
import { FavoriteItem } from '@repo/lib/queries/get-favorite-item.ts';
import { UserTimeFromServer } from '@repo/lib/queries/get-user-time-from-server.ts';

export type UserCardQuery = {
  user: RequestedUser,
  favoriteItem: FavoriteItem | null,
  stats: {
    friendsCount: number,
    threadsCount: number,
    joined: UserTimeFromServer | null
  },
}

const USER_CARD_QUERY_KEY = (nickname: string) => [ 'user', 'card', nickname ];

export const userCardQuery = (nickname: string) => useQuery<
  UserCardQuery | null, Error
>({
  queryKey: USER_CARD_QUERY_KEY(nickname),
  queryFn: () => getUserMainInformation({ nickname }),
  refetchOnWindowFocus: false,
  retry: 1,
  placeholderData: keepPreviousData,
  enabled: !!nickname
});