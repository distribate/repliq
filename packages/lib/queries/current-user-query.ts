import { keepPreviousData, QueryKey, useQuery } from '@tanstack/react-query';
import { getUserInformation } from './get-user-information.ts';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { DonateType } from '@repo/components/src/user/components/donate/queries/get-user-donate.ts';
import { UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';

export const CURRENT_USER_QUERY_KEY: QueryKey = [ 'user', 'current' ];

export type CurrentUser = Omit<UserEntity, 'preferences'
  | 'visibility' | 'acceptrules'
> & {
  donate: DonateType['primary_group'] | null,
  preferences: UserPreferences,
  visibility: Pick<UserEntity, 'visibility'>['visibility'],
  cover_image: Pick<UserEntity, 'cover_image'>['cover_image']
}

export const currentUserQuery = () => useQuery({
  queryKey: CURRENT_USER_QUERY_KEY,
  queryFn: () => getUserInformation(),
  placeholderData: keepPreviousData,
});