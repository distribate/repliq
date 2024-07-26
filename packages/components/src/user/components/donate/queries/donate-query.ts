import { useQuery } from '@tanstack/react-query';
import { DonateType, getUserDonate } from './get-user-donate.ts';
import { UserDonate } from '../types/user-donate-types.ts';
import { FavoriteItem, getFavoriteItem } from '@repo/lib/queries/get-favorite-item.ts';

export const DONATE_QUERY_KEY = (nickname?: string) => {
  return [ 'user', 'donate', nickname ];
};

export type DonateQuery = {
  donate: DonateType['primary_group'],
  favoriteItemImage: FavoriteItem | null
}

async function getDonate({
  nickname,
}: UserDonate) {
  const donate = await getUserDonate(nickname);
  
  const image = await getFavoriteItem({
    nickname, type: 'nickname',
  });
  
  return { donate, favoriteItemImage: image };
}

export const donateQuery = ({
  nickname,
}: UserDonate) => {
  return useQuery<DonateQuery, Error>({
    queryKey: DONATE_QUERY_KEY(nickname),
    queryFn: () => getDonate({ nickname }),
    refetchOnWindowFocus: false,
  });
};