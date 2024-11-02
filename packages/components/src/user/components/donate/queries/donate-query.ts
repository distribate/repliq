import { useQuery } from '@tanstack/react-query';
import { DonateType, getUserDonate } from './get-user-donate.ts';
import { UserDonate } from '../types/user-donate-types.ts';
import { FavoriteItem, getFavoriteItem } from '@repo/lib/queries/get-favorite-item.ts';

export const DONATE_QUERY_KEY = (nickname?: string) => {
  return [ 'user', 'donate', nickname ];
};

export type DonateQuery = {
  nickname: Pick<UserDonate, 'nickname'>['nickname']
  existingDonate?: DonateType['primary_group'],
}

async function getDonate({
  nickname, existingDonate
}: DonateQuery): Promise<{
  donate: DonateType['primary_group'],
  favoriteItemImage: FavoriteItem | null
}> {
  let donate: DonateType['primary_group'];
  
  if (!existingDonate) {
    donate = await getUserDonate(nickname);
  } else {
    donate = existingDonate;
  }
  
  const image = await getFavoriteItem({
    nickname, type: 'nickname',
  });
  
  return { donate, favoriteItemImage: image };
}

export const donateQuery = ({
  nickname, existingDonate,
}: DonateQuery) => {
  return useQuery({
    queryKey: DONATE_QUERY_KEY(nickname),
    queryFn: () => getDonate({ nickname, existingDonate }),
    refetchOnWindowFocus: false
  });
};