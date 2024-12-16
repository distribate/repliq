import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { RequestedUser } from '@repo/lib/queries/get-requested-user.ts';
import { getUserMainInformation } from './get-user-main-information.ts';
import { FavoriteItem } from '@repo/lib/queries/get-favorite-item.ts';
import { UserTimeFromServer } from '@repo/lib/queries/get-user-time-from-server.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export type UserCardQuery = {
  user: RequestedUser;
  favoriteItem: FavoriteItem | null;
  stats: {
    friendsCount: number;
    threadsCount: number;
    joined: UserTimeFromServer | null;
  };
};

const USER_CARD_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["card"], nickname)

export const userCardQuery = (nickname: string) => useQuery({
  queryKey: USER_CARD_QUERY_KEY(nickname),
  queryFn: () => getUserMainInformation({ nickname }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
});